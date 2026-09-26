import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import type { RepoItem } from '../src/data/types.ts';

/**
 * Markdown içindeki bağıl dosya ve görsel yollarını tam GitHub URL'lerine dönüştürür.
 */
function resolveRelativeMarkdownUrls(
  mdText: string,
  owner: string,
  repo: string,
  defaultBranch = 'main',
): string {
  if (!mdText) return '';
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}`;
  const blobBase = `https://github.com/${owner}/${repo}/blob/${defaultBranch}`;

  // Markdown görselleri: ![alt](path)
  let result = mdText.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
    const trimmed = url.trim();
    if (/^(https?:|\/\/|data:|#)/i.test(trimmed)) return match;
    const cleanUrl = trimmed.replace(/^\.\//, '').replace(/^\//, '');
    return `![${alt}](${rawBase}/${cleanUrl})`;
  });

  // HTML img etiketleri: <img src="path" ...>
  result = result.replace(
    /(<img\s+[^>]*?src=["'])([^"']+)(["'][^>]*?>)/gi,
    (match, prefix, src, suffix) => {
      const trimmed = src.trim();
      if (/^(https?:|\/\/|data:|#)/i.test(trimmed)) return match;
      const cleanUrl = trimmed.replace(/^\.\//, '').replace(/^\//, '');
      return `${prefix}${rawBase}/${cleanUrl}${suffix}`;
    },
  );

  // Markdown bağlantıları: [text](path)
  result = result.replace(
    /(?<!\!)\[([^\]]+)\]\(([^)]+)\)/g,
    (match, text, url) => {
      const trimmed = url.trim();
      if (/^(https?:|\/\/|mailto:|tel:|#)/i.test(trimmed)) return match;
      const cleanUrl = trimmed.replace(/^\.\//, '').replace(/^\//, '');
      return `[${text}](${blobBase}/${cleanUrl})`;
    },
  );

  return result;
}

interface ReadmeParsed {
  h1: string;
  summary: string;
  fullParagraph: string;
  firstImageUrl: string | null;
}

function parseReadmeMarkdown(markdown: string): ReadmeParsed {
  const h1Match = markdown.match(/^#\s+(.+)$/m);
  const h1 = h1Match ? h1Match[1].replace(/^[^\w\s\u00C0-\u017F]+/, '').trim() : '';

  const imgMatch = markdown.match(/!\[.*?\]\((https?:\/\/.*?)\)/);
  const firstImageUrl = imgMatch ? imgMatch[1] : null;

  let cleaned = markdown
    .replace(/^#+\s+.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .trim();

  const installationIndex = cleaned.search(
    /##?\s*(Installation|Setup|Quick Start|Getting Started|Kurulum)/i,
  );
  if (installationIndex !== -1) {
    cleaned = cleaned.substring(0, installationIndex);
  }

  const paragraphs = cleaned
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const fullParagraph = paragraphs[0] || '';
  const summary =
    fullParagraph.length > 220
      ? fullParagraph.substring(0, 217) + '...'
      : fullParagraph;

  return {
    h1,
    summary,
    fullParagraph,
    firstImageUrl,
  };
}

/**
 * GitHub Raw URL üzerinden (API limitlerine takılmadan) README çeker.
 */
async function fetchRawReadme(repoName: string): Promise<{ raw: string; branch: string } | null> {
  const branches = ['main', 'master'];
  for (const branch of branches) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);
      const url = `https://raw.githubusercontent.com/omerabali/${repoName}/${branch}/README.md`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 20) {
          return { raw: text, branch };
        }
      }
    } catch {
      // Bir sonraki dalı dene
    }
  }
  return null;
}

async function syncAndEnrichRepos(): Promise<RepoItem[]> {
  const reposFilePath = path.join(process.cwd(), 'src', 'data', 'repos.json');
  let currentRepos: RepoItem[] = [];

  if (fs.existsSync(reposFilePath)) {
    try {
      currentRepos = JSON.parse(fs.readFileSync(reposFilePath, 'utf-8'));
    } catch (err) {
      console.warn('Existing repos.json could not be parsed:', err);
    }
  }

  console.log(`Processing ${currentRepos.length} portfolio repositories...`);

  // Her deponun README'sini canlı doğrula veya zenginleştir
  const updatedRepos = await Promise.all(
    currentRepos.map(async (repo) => {
      // Eğer deponun zaten detaylı bir README'si varsa koru, yoksa canlı çekmeyi dene
      if (!repo.readme_raw || repo.readme_raw.length < 50) {
        const rawResult = await fetchRawReadme(repo.name);
        if (rawResult) {
          const resolved = resolveRelativeMarkdownUrls(
            rawResult.raw,
            'omerabali',
            repo.name,
            rawResult.branch,
          );
          const parsed = parseReadmeMarkdown(resolved);

          return {
            ...repo,
            readme_raw: resolved,
            readme_detail: resolved,
            readme_h1: parsed.h1 || repo.readme_h1 || repo.display_name,
            readme_summary: parsed.summary || repo.readme_summary || repo.description,
            image_url: parsed.firstImageUrl || repo.image_url,
          };
        }
      }
      return repo;
    }),
  );

  return updatedRepos;
}

async function main() {
  try {
    const repos = await syncAndEnrichRepos();
    const outputDir = path.join(process.cwd(), 'src', 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'repos.json');
    fs.writeFileSync(outputPath, JSON.stringify(repos, null, 2), 'utf-8');
    console.log(`✓ Synchronized ${repos.length} repositories to ${outputPath}`);
  } catch (error) {
    console.warn('Repository sync completed with fallback dataset:', error);
  }
}

main();
