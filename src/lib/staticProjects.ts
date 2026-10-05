import type { Project, ProjectDetail } from '../types/project';
import { PROJECT_OVERRIDES } from '../config/portfolioProjects';
import staticCatalog from '../data/projects.json';

/** Ana sayfa öne çıkan öncelik sırası */
export const FEATURED_PRIORITY_SLUGS = [
  'skill-identity-engine',
  'ai-medium-design',
  'staj22001',
] as const;

const README_MODULES = import.meta.glob('../data/readmes/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findStaticReadme(slug: string, repoName?: string): string | null {
  const targets = [slug, repoName]
    .filter(Boolean)
    .map((v) => normalizeKey(String(v)));

  for (const [path, content] of Object.entries(README_MODULES)) {
    const base = path.split('/').pop()?.replace(/\.md$/i, '') ?? '';
    const key = normalizeKey(base);
    if (targets.includes(key)) {
      return typeof content === 'string' ? content : null;
    }
  }

  // Gevşek eşleşme: slug dosya adında geçiyorsa
  for (const [path, content] of Object.entries(README_MODULES)) {
    const base = path.split('/').pop()?.replace(/\.md$/i, '') ?? '';
    const key = normalizeKey(base);
    if (targets.some((t) => t.length > 2 && (key.includes(t) || t.includes(key)))) {
      return typeof content === 'string' ? content : null;
    }
  }

  return null;
}

type StaticRow = {
  slug: string;
  name: string;
  display_name?: string;
  description?: string | null;
  url: string;
  homepage?: string | null;
  languages?: string[];
  stars?: number;
  forks?: number;
  updatedAt?: string;
  hasReadme?: boolean;
};

function mapCategory(overrideCategory?: string): string {
  const c = (overrideCategory || '').toLowerCase();
  if (c.includes('yapay') || c.includes('ai')) return 'ai-ml';
  if (c.includes('mobil') || c.includes('mobile')) return 'mobile';
  if (c.includes('web') || c.includes('bulut') || c.includes('cloud')) return 'web-cloud';
  return 'software-algo';
}

function mapStaticRow(row: StaticRow, index: number): Project {
  const key = row.slug.toLowerCase();
  const override = PROJECT_OVERRIDES[key] || PROJECT_OVERRIDES[row.name.toLowerCase()];
  const display = override?.display_name || row.display_name || row.name;
  const description = override?.description || row.description || null;
  const tags = row.languages || [];

  return {
    id: `static-${index}-${row.slug}`,
    slug: row.slug,
    name: row.name,
    repo_name: row.name,
    display_name: display,
    title_tr: display,
    title_en: display,
    description,
    description_tr: description,
    description_en: description,
    category: mapCategory(override?.category) || 'software-algo',
    tech_stack: tags,
    tags,
    topics: [],
    features: [],
    github_url: row.url,
    demo_url: row.homepage || null,
    homepage: row.homepage || null,
    cover_image_url: override?.image_url || null,
    image_url: override?.image_url || null,
    stars: row.stars || 0,
    forks: row.forks || 0,
    has_readme: Boolean(row.hasReadme),
    is_featured: Boolean(override?.is_featured),
    is_published: true,
    sort_order: index + 1,
    updated_at: row.updatedAt || new Date().toISOString(),
  };
}

/** Build-time gömülü katalog — API/DB düşünce fallback */
export const STATIC_PROJECTS: Project[] = (staticCatalog as StaticRow[]).map(mapStaticRow);

export function getStaticFeaturedProjects(limit = 3): Project[] {
  const selected: Project[] = [];
  for (const slug of FEATURED_PRIORITY_SLUGS) {
    const found = STATIC_PROJECTS.find(
      (p) =>
        p.slug.toLowerCase() === slug ||
        p.name.toLowerCase() === slug ||
        p.slug.toLowerCase().includes(slug),
    );
    if (found && !selected.some((s) => s.slug === found.slug)) {
      selected.push(found);
    }
  }
  if (selected.length < limit) {
    for (const p of STATIC_PROJECTS) {
      if (!selected.some((s) => s.slug === p.slug)) selected.push(p);
      if (selected.length >= limit) break;
    }
  }
  return selected.slice(0, limit);
}

export function getStaticProjectDetail(slug: string): ProjectDetail | null {
  const needle = slug.toLowerCase();
  const project = STATIC_PROJECTS.find(
    (p) =>
      p.slug.toLowerCase() === needle ||
      p.name.toLowerCase() === needle ||
      p.repo_name?.toLowerCase() === needle ||
      normalizeKey(p.slug) === normalizeKey(needle) ||
      normalizeKey(p.name) === normalizeKey(needle),
  );
  if (!project) return null;

  const readme = findStaticReadme(project.slug, project.repo_name || project.name);
  return {
    ...project,
    has_readme: Boolean(readme),
    readme_markdown: readme,
    readme_raw: readme,
  };
}
