import { useCallback, useEffect, useState } from 'react';
import type { Project } from '../../types/project';
import { fetchProjects } from '../api/projects';
import initialReposData from '../../data/repos.json';

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  total: number;
  reload: () => void;
}

// Map initial JSON fallback to Project format for instant 0ms paint
const fallbackProjects: Project[] = (initialReposData as any[])
  .map((r) => ({
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
  }))
  .sort((a, b) => {
    const timeA = new Date(a.created_at || a.pushed_at || a.updated_at || 0).getTime();
    const timeB = new Date(b.created_at || b.pushed_at || b.updated_at || 0).getTime();
    return timeB - timeA;
  });

const CACHE_KEY = 'portfolio_projects_cache_v5';

function getInitialCached(): { projects: Project[]; total: number } {
  try {
    const stored = sessionStorage.getItem(CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed?.data) && parsed.data.length > 0) {
        return { projects: parsed.data, total: parsed.total || parsed.data.length };
      }
    }
  } catch {
    // Ignore storage error
  }
  return {
    projects: fallbackProjects,
    total: fallbackProjects.length,
  };
}

/**
 * Stale-While-Revalidate pattern:
 * 1. Sayfa açıldığı an 0.00 ms gecikmeyle yerel önbellekten (RAM/JSON) anında gösterilir.
 * 2. Arka planda sessizce /api/projects kontrol edilir, değişiklik varsa akıcı güncellenir.
 */
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
          setProjects(data);
          const newTotal = res?.total ?? data.length;
          setTotal(newTotal);

          // Save in fast session storage
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, total: newTotal }));
          } catch {
            // Ignore
          }
        }
      })
      .catch(() => {
        if (!active) return;
        // If we already have cached projects, don't show an intrusive error
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
