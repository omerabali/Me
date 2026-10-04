/**
 * README ham markdown'ından kart formu için meta çıkarır.
 * DB'deki markdown değiştirilmez; sadece form alanları için tahmin üretir.
 */

export type ProjectCategory = 'ai-ml' | 'web-cloud' | 'mobile' | 'software-algo';

export interface ReadmeMeta {
  title: string | null;
  description: string | null;
  tags: string[];
  categoryHint: ProjectCategory;
}

const DESC_MAX = 220;

const KNOWN_TECH: { pattern: RegExp; label: string }[] = [
  { pattern: /\breact\b/i, label: 'React' },
  { pattern: /\bnext\.?js\b/i, label: 'Next.js' },
  { pattern: /\bvue\b/i, label: 'Vue' },
  { pattern: /\bnuxt\b/i, label: 'Nuxt' },
  { pattern: /\bangular\b/i, label: 'Angular' },
  { pattern: /\bsvelte\b/i, label: 'Svelte' },
  { pattern: /\btypescript\b/i, label: 'TypeScript' },
  { pattern: /\bjavascript\b/i, label: 'JavaScript' },
  { pattern: /\bpython\b/i, label: 'Python' },
  { pattern: /\bflutter\b/i, label: 'Flutter' },
  { pattern: /\bdart\b/i, label: 'Dart' },
  { pattern: /\bfastapi\b/i, label: 'FastAPI' },
  { pattern: /\bdjango\b/i, label: 'Django' },
  { pattern: /\bflask\b/i, label: 'Flask' },
  { pattern: /\bnode\.?js\b/i, label: 'Node.js' },
  { pattern: /\bexpress\b/i, label: 'Express' },
  { pattern: /\btailwind\b/i, label: 'Tailwind CSS' },
  { pattern: /\bvite\b/i, label: 'Vite' },
  { pattern: /\bpostgresql|postgres\b/i, label: 'PostgreSQL' },
  { pattern: /\bmongodb\b/i, label: 'MongoDB' },
  { pattern: /\bredis\b/i, label: 'Redis' },
  { pattern: /\bdocker\b/i, label: 'Docker' },
  { pattern: /\bkubernetes|k8s\b/i, label: 'Kubernetes' },
  { pattern: /\byolov?\d*\b/i, label: 'YOLO' },
  { pattern: /\btensorflow\b/i, label: 'TensorFlow' },
  { pattern: /\bpytorch\b/i, label: 'PyTorch' },
  { pattern: /\bopenai\b/i, label: 'OpenAI' },
  { pattern: /\blangchain\b/i, label: 'LangChain' },
  { pattern: /\bjava\b/i, label: 'Java' },
  { pattern: /\bkotlin\b/i, label: 'Kotlin' },
  { pattern: /\bswift\b/i, label: 'Swift' },
  { pattern: /\bc\+\+\b/i, label: 'C++' },
  { pattern: /\bc#\b/i, label: 'C#' },
  { pattern: /\bgo(lang)?\b/i, label: 'Go' },
  { pattern: /\brust\b/i, label: 'Rust' },
  { pattern: /\bspring\b/i, label: 'Spring' },
  { pattern: /\bmaterial\s*3?\b/i, label: 'Material 3' },
  { pattern: /\bmermaid\b/i, label: 'Mermaid' },
  { pattern: /\bgraphql\b/i, label: 'GraphQL' },
  { pattern: /\bsqlalchemy\b/i, label: 'SQLAlchemy' },
];

const TECH_SECTION =
  /^#{2,3}\s+.*(?:kullanılan\s+teknoloj|tech(?:nolog(?:y|ies))?|stack|bağımlılık|dependencies|built with).*$/i;

function stripEmoji(text: string): string {
  return text
    .replace(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu,
      ''
    )
    .replace(/\s+/g, ' ')
    .trim();
}

function stripInlineMd(text: string): string {
  return text
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/<\/?[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

export function extractTitle(md: string): string | null {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  for (const line of lines) {
    const m = line.match(/^#\s+(.+)$/);
    if (m) {
      const title = stripEmoji(stripInlineMd(m[1]));
      return title || null;
    }
  }
  return null;
}

export function extractDescription(md: string): string | null {
  const text = md.replace(/\r\n/g, '\n').replace(/^\uFEFF/, '');
  const lines = text.split('\n');
  let pastH1 = false;
  const buf: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    if (!pastH1) {
      if (/^#\s+/.test(line)) pastH1 = true;
      continue;
    }

    if (!line) {
      if (buf.length) break;
      continue;
    }

    // Atlama: başlık, liste, alıntı, kod, tablo, HTML blok, yatay çizgi
    if (
      /^#{1,6}\s/.test(line) ||
      /^[-*+]\s/.test(line) ||
      /^\d+\.\s/.test(line) ||
      /^>\s?/.test(line) ||
      /^```/.test(line) ||
      /^\|/.test(line) ||
      /^(-{3,}|\*{3,}|_{3,})$/.test(line) ||
      /^<\/?(div|p|img|table|details|center)\b/i.test(line)
    ) {
      if (buf.length) break;
      continue;
    }

    buf.push(line);
    // Paragraf birden fazla satır olabilir; boş satıra veya blok başlangıcına kadar
    while (i + 1 < lines.length) {
      const next = lines[i + 1].trim();
      if (
        !next ||
        /^#{1,6}\s/.test(next) ||
        /^[-*+]\s/.test(next) ||
        /^\d+\.\s/.test(next) ||
        /^>\s?/.test(next) ||
        /^```/.test(next) ||
        /^\|/.test(next)
      ) {
        break;
      }
      i++;
      buf.push(next);
    }
    break;
  }

  if (!buf.length) return null;
  const cleaned = stripInlineMd(buf.join(' '));
  if (cleaned.length < 12) return null;
  return truncate(cleaned, DESC_MAX);
}

function extractTagsFromTechSection(md: string): string[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const tags: string[] = [];
  let inSection = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (TECH_SECTION.test(line)) {
      inSection = true;
      continue;
    }
    if (inSection) {
      if (/^#{1,6}\s/.test(line)) break;
      if (!line) continue;
      const item = line.match(/^[-*+]\s+(?:\*\*)?(.+?)(?:\*\*)?(?::.*)?$/);
      if (item) {
        const label = stripInlineMd(item[1].split(/[—–:-]/)[0] || item[1]);
        if (label && label.length < 40) tags.push(label);
      }
    }
  }
  return tags;
}

function extractTagsFromBadges(md: string): string[] {
  const tags: string[] = [];
  const badgeRe =
    /(?:shields\.io\/badge\/|badge\/)([A-Za-z0-9_.+-]+?)(?:-|%20|_|\?)/gi;
  let m: RegExpExecArray | null;
  while ((m = badgeRe.exec(md)) !== null) {
    const raw = decodeURIComponent(m[1].replace(/_/g, ' '));
    const cleaned = raw.replace(/\+/g, ' ').trim();
    if (cleaned.length >= 2 && cleaned.length < 30) tags.push(cleaned);
  }
  return tags;
}

function extractTagsFromDictionary(md: string): string[] {
  const found: string[] = [];
  for (const { pattern, label } of KNOWN_TECH) {
    if (pattern.test(md)) found.push(label);
  }
  return found;
}

export function extractTags(md: string): string[] {
  const fromSection = extractTagsFromTechSection(md);
  const fromBadges = extractTagsFromBadges(md);
  const fromDict = extractTagsFromDictionary(md);

  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of [...fromSection, ...fromBadges, ...fromDict]) {
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
    if (out.length >= 12) break;
  }
  return out;
}

function countMatches(text: string, patterns: RegExp[]): number {
  return patterns.reduce((n, re) => n + (re.test(text) ? 1 : 0), 0);
}

export function guessCategory(md: string): ProjectCategory {
  const lower = md.toLowerCase();

  // Zayıf tek başına "ai"/"ml" kullanma (Material, HTML vb. yanlış pozitif üretir)
  const aiScore = countMatches(lower, [
    /\byolo\b/,
    /\btensorflow\b/,
    /\bpytorch\b/,
    /\bmachine learning\b/,
    /\bmakine öğren/,
    /\bdeep learning\b/,
    /\bcomputer vision\b/,
    /\bbilgisayarlı görü\b/,
    /\bsegmentation\b/,
    /\blangchain\b/,
    /\bopenai\b/,
    /\bllm\b/,
    /\bnlp\b/,
    /\byapay zeka\b/,
  ]);

  const mobileScore = countMatches(lower, [
    /\bflutter\b/,
    /\bdart\b/,
    /\bandroid\b/,
    /\bios\b/,
    /\bswift\b/,
    /\bkotlin\b/,
    /\breact native\b/,
    /\bmobil(?:e| uygulama)?\b/,
  ]);

  const webScore = countMatches(lower, [
    /\breact\b/,
    /\bnext\.?js\b/,
    /\bvue\b/,
    /\bnuxt\b/,
    /\bvite\b/,
    /\btailwind\b/,
    /\bfastapi\b/,
    /\bdjango\b/,
    /\bexpress\b/,
    /\bnode\.?js\b/,
    /\btypescript\b/,
    /\bjavascript\b/,
  ]);

  // Flutter/Dart mobil projelerde quiz konularında React/Python geçse bile mobile kazanır
  if (/\bflutter\b/.test(lower) || /\bdart\b/.test(lower)) {
    return 'mobile';
  }

  if (aiScore >= 1 && aiScore >= mobileScore && aiScore >= webScore) return 'ai-ml';
  if (mobileScore >= 1 && mobileScore >= webScore) return 'mobile';
  if (webScore >= 1) return 'web-cloud';
  return 'software-algo';
}

/**
 * README markdown'ından form meta alanlarını çıkarır.
 */
export function extractMetaFromReadme(md: string): ReadmeMeta {
  const text = (md || '').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  if (!text.trim()) {
    return { title: null, description: null, tags: [], categoryHint: 'software-algo' };
  }

  return {
    title: extractTitle(text),
    description: extractDescription(text),
    tags: extractTags(text),
    categoryHint: guessCategory(text),
  };
}
