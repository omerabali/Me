import type { Project, ProjectDetail, ProjectsListResponse } from '../../types/project';
import realReposData from '../../data/repos.json';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Yerel snapshot yedek verisi
const mappedLocalRepos: Project[] = (realReposData as any[])
  .map((r) => ({
    slug: (r.name || '').toLowerCase(),
    name: r.name,
    display_name: r.display_name || r.name,
    description: r.readme_summary || r.description || r.readme_detail || null,
    readme_h1: r.readme_h1 || null,
    readme_detail: r.readme_detail || null,
    readme_summary: r.readme_summary || null,
    readme_raw: r.readme_raw || null,
    readme_html: r.readme_html || null,
    image_url: r.image_url || `https://opengraph.githubassets.com/1/omerabali/${r.name}`,
    tech_stack: r.tech_stack || (r.language ? [r.language] : []),
    features: r.features || [],
    category: r.category || 'Yazılım',
    languages: r.language ? { [r.language]: 100 } : {},
    github_url: r.html_url || `https://github.com/omerabali/${r.name}`,
    homepage: r.homepage || null,
    stars: r.stargazers_count || 0,
    forks: r.forks_count || 0,
    open_issues: 0,
    topics: r.topics || [],
    is_showcased: Boolean(r.is_featured || r.topics?.includes('portfolio-featured')),
    created_at: r.created_at || r.updated_at || new Date().toISOString(),
    updated_at: r.updated_at || new Date().toISOString(),
    pushed_at: r.pushed_at || null,
  }))
  .sort((a, b) => {
    const timeA = new Date(a.created_at || a.pushed_at || a.updated_at || 0).getTime();
    const timeB = new Date(b.created_at || b.pushed_at || b.updated_at || 0).getTime();
    return timeB - timeA;
  });

/**
 * Backend FastAPI servisinden (/api/projects) canlı GitHub depolarını ve README içeriklerini çeker.
 */
export async function fetchProjects(refresh: boolean = false): Promise<ProjectsListResponse> {
  const endpoints = [
    `${API_BASE_URL}/api/projects${refresh ? '?refresh=true' : ''}`,
    `http://127.0.0.1:8000/api/projects${refresh ? '?refresh=true' : ''}`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          return data;
        }
      }
    } catch {
      // Bir sonraki uç noktayı dene
    }
  }

  // Backend kapalıysa veya ağ erişimi yoksa önceden derlenmiş yerel snapshot'a düş
  return {
    total: mappedLocalRepos.length,
    showcased_count: mappedLocalRepos.filter((p) => p.is_showcased).length,
    cached: true,
    data: mappedLocalRepos,
  };
}

/**
 * Belirli bir projenin tam canlı GitHub ve README detayını çeker.
 */
export async function fetchProjectDetail(slug: string, refresh: boolean = false): Promise<ProjectDetail | null> {
  const endpoints = [
    `${API_BASE_URL}/api/projects/${slug}${refresh ? '?refresh=true' : ''}`,
    `http://127.0.0.1:8000/api/projects/${slug}${refresh ? '?refresh=true' : ''}`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback
    }
  }

  const localMatch = mappedLocalRepos.find(
    (p) => p.slug === slug.toLowerCase() || p.name.toLowerCase() === slug.toLowerCase()
  );
  if (localMatch) {
    return {
      ...localMatch,
      readme_raw: localMatch.readme_detail || localMatch.readme_raw || null,
      readme_html: null,
      default_branch: 'main',
      license: 'MIT',
      archived: false,
    };
  }

  return null;
}
