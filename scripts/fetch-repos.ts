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
      const timeout = setTimeout(() => controller.abort(), 4000);
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

/**
 * Canlı GitHub API'sinden omerabali kullanıcısının tüm depolarını çeker.
 */
async function fetchUserReposFromGitHub(): Promise<any[] | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const res = await fetch('https://api.github.com/users/omerabali/repos?per_page=100&sort=pushed', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'omerabali-portfolio-builder',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('GitHub API live request failed, using cached repos:', err);
  }
  return null;
}

function inferCategory(repo: any): 'AI/ML' | 'Full-Stack' | 'Mobile' | 'Backend / Systems' {
  const lang = (repo.language || '').toLowerCase();
  const name = (repo.name || '').toLowerCase();
  const desc = (repo.description || '').toLowerCase();
  const topics = (repo.topics || []).map((t: string) => t.toLowerCase());

  if (lang === 'dart' || topics.includes('flutter') || name.includes('quiz_app') || desc.includes('flutter')) {
    return 'Mobile';
  }
  if (
    lang === 'python' ||
    topics.includes('ai') ||
    topics.includes('machine-learning') ||
    name.includes('ai') ||
    name.includes('segmentation') ||
    name.includes('yolo') ||
    name.includes('bot') ||
    desc.includes('ai') ||
    desc.includes('model')
  ) {
    return 'AI/ML';
  }
  if (
    lang === 'typescript' ||
    lang === 'javascript' ||
    lang === 'html' ||
    lang === 'css' ||
    topics.includes('react') ||
    topics.includes('web')
  ) {
    return 'Full-Stack';
  }
  return 'Backend / Systems';
}

async function syncAndEnrichRepos(): Promise<RepoItem[]> {
  const reposFilePath = path.join(process.cwd(), 'src', 'data', 'repos.json');
  let localRepos: any[] = [];

  if (fs.existsSync(reposFilePath)) {
    try {
      localRepos = JSON.parse(fs.readFileSync(reposFilePath, 'utf-8'));
    } catch (err) {
      console.warn('Existing repos.json could not be parsed:', err);
    }
  }

  const localMap = new Map<string, any>();
  for (const r of localRepos) {
    if (r.name) localMap.set(r.name.toLowerCase(), r);
  }

  // 1. Canlı GitHub API'sinden depoları çek
  console.log('Fetching live repositories from GitHub API (user: omerabali)...');
  const remoteRepos = await fetchUserReposFromGitHub();

  let targetRepos: any[] = [];

  if (remoteRepos && remoteRepos.length > 0) {
    console.log(`✓ Fetched ${remoteRepos.length} repositories directly from GitHub API.`);
    targetRepos = remoteRepos.map((ghRepo) => {
      const existing = localMap.get(ghRepo.name.toLowerCase());
      const cat = existing?.category || inferCategory(ghRepo);

      // STAJ22001 veya diğer depolarda yapay 'Beacon' isimlendirmelerini temizle, gerçek repo ismini kullan
      let cleanDisplayName = existing?.display_name || ghRepo.name;
      if (cleanDisplayName.includes('Beacon') || ghRepo.name === 'STAJ22001') {
        cleanDisplayName = 'STAJ22001 — Staj Dosyası & Projeleri';
      }

      let cleanSummary = existing?.readme_summary || ghRepo.description || '';
      if (cleanSummary.includes('Beacon platformunu')) {
        cleanSummary = 'Staj süreci boyunca geliştirilen alt projeleri, Web Workers çalışmalarını ve teknik dokümantasyonu içerir.';
      }

      return {
        id: ghRepo.id || existing?.id || ghRepo.name.toLowerCase(),
        name: ghRepo.name,
        display_name: cleanDisplayName,
        description: ghRepo.description || existing?.description || '',
        html_url: ghRepo.html_url,
        homepage: ghRepo.homepage || existing?.homepage || null,
        language: ghRepo.language || existing?.language || null,
        stargazers_count: ghRepo.stargazers_count ?? existing?.stargazers_count ?? 0,
        forks_count: ghRepo.forks_count ?? existing?.forks_count ?? 0,
        topics: ghRepo.topics || existing?.topics || [],
        created_at: ghRepo.created_at || existing?.created_at || new Date().toISOString(),
        updated_at: ghRepo.updated_at || existing?.updated_at || new Date().toISOString(),
        pushed_at: ghRepo.pushed_at || existing?.pushed_at || null,
        category: cat,
        tech_stack: existing?.tech_stack || (ghRepo.language ? [ghRepo.language] : []),
        features: existing?.features || [],
        readme_raw: existing?.readme_raw || null,
        readme_detail: existing?.readme_detail || null,
        readme_summary: cleanSummary,
        readme_h1: existing?.readme_h1 || null,
        image_url: existing?.image_url || null,
        is_featured: existing?.is_featured || false,
      };
    });
  } else {
    console.log(`Using ${localRepos.length} local repositories as fallback.`);
    targetRepos = localRepos.map((r) => {
      let dName = r.display_name || r.name;
      if (dName.includes('Beacon') || r.name === 'STAJ22001') {
        dName = 'STAJ22001 — Staj Dosyası & Projeleri';
      }
      return { ...r, display_name: dName };
    });
  }

  // 2. Her deponun README'sini canlı doğrula veya zenginleştir
  console.log(`Processing README and media for ${targetRepos.length} repositories...`);
  const updatedRepos = await Promise.all(
    targetRepos.map(async (repo) => {
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
