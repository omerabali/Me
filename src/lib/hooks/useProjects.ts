import { useCallback, useEffect, useState } from 'react';
import type { Project } from '../../types/project';
import { fetchProjects } from '../api/projects';
import initialReposData from '../../data/repos.json';
import {
  EXCLUDED_REPOS,
  PROJECT_OVERRIDES,
  MANUAL_ADDITIONAL_REPOS,
} from '../../config/portfolioProjects';

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  total: number;
  reload: () => void;
}

function curateProjects(rawProjects: Project[]): Project[] {
  const excludedSet = new Set(EXCLUDED_REPOS.map((e) => e.toLowerCase()));

  const filtered = rawProjects.filter((p) => {
    const slug = (p.slug || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    return !excludedSet.has(slug) && !excludedSet.has(name);
  });

  const overridden = filtered.map((p) => {
    const slug = (p.slug || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const override = PROJECT_OVERRIDES[slug] || PROJECT_OVERRIDES[name];

    if (!override) return p;

    return {
      ...p,
      display_name: override.display_name || p.display_name,
      description: override.description || p.description,
      category: override.category || p.category,
      image_url: override.image_url || p.image_url,
      is_showcased: override.is_featured ?? p.is_showcased,
    };
  });

  const combined = [...MANUAL_ADDITIONAL_REPOS, ...overridden];

  // En son push yapılan / güncellenen repo en üstte (GitHub ile birebir aynı sıra)
  return combined.sort((a, b) => {
    const timeA = new Date(a.pushed_at || a.updated_at || a.created_at || 0).getTime();
    const timeB = new Date(b.pushed_at || b.updated_at || b.created_at || 0).getTime();
    return timeB - timeA;
  });
}

const rawInitialProjects: Project[] = (initialReposData as any[]).map((r) => ({
  slug: r.name ? r.name.toLowerCase() : '',
  name: r.name || '',
  display_name: r.display_name || r.name || '',
  description: r.description || r.readme_summary || '',
  readme_h1: r.readme_h1,
  readme_summary: r.readme_summary,
  readme_detail: r.readme_detail || r.readme_raw,
  readme_raw: r.readme_raw,
  readme_html: r.readme_html,
  image_url: r.image_url,
  category: r.category || 'Yazılım',
  features: r.features || [],
  tech_stack: r.tech_stack || [],
  languages: r.languages || {},
  github_url: r.html_url || `https://github.com/omerabali/${r.name}`,
  homepage: r.homepage || null,
  stars: r.stargazers_count || 0,
  forks: r.forks_count || 0,
  open_issues: 0,
  topics: r.topics || [],
  is_showcased: Boolean(r.is_featured || (r.topics && r.topics.includes('portfolio-featured'))),
  created_at: r.created_at || r.updated_at || new Date().toISOString(),
  updated_at: r.updated_at || new Date().toISOString(),
  pushed_at: r.pushed_at || null,
}));

const fallbackProjects: Project[] = curateProjects(rawInitialProjects);

const CACHE_KEY = 'portfolio_projects_cache_v8';

function getInitialCached(): { projects: Project[]; total: number } {
  try {
    const stored = sessionStorage.getItem(CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed?.data) && parsed.data.length > 0) {
        return { projects: parsed.data, total: Math.max(parsed.total || parsed.data.length, 60) };
      }
    }
  } catch {
    // Ignore storage error
  }
  return {
    projects: fallbackProjects,
    total: Math.max(fallbackProjects.length, 60),
  };
}

export function useProjects(): ProjectsState {
  const initial = getInitialCached();
  const [projects, setProjects] = useState<Project[]>(initial.projects);
  const [total, setTotal] = useState(initial.total);
  const [loading, setLoading] = useState(initial.projects.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let active = true;

    fetchProjects()
      .then((res) => {
        if (!active) return;
        const data = res?.data ?? [];
        if (data.length > 0) {
          const curated = curateProjects(data);
          setProjects(curated);
          const newTotal = Math.max(res?.total ?? curated.length, 60);
          setTotal(newTotal);

          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: curated, total: newTotal }));
          } catch {
            // Ignore
          }
        }
      })
      .catch(() => {
        if (!active) return;
        if (projects.length === 0) {
          setError('Projeler şu anda yüklenemedi.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [nonce]);

  return { projects, loading, error, total, reload };
}
