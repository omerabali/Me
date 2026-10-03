import type { Project, ProjectDetail, ProjectsListResponse } from '../../types/project';
import realReposData from '../../data/repos.json';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Yerel snapshot yedek verisi
const mappedLocalRepos: Project[] = (realReposData as any[])
  .map((r) => {
    let cleanDisplayName = r.display_name || r.name;
    if (cleanDisplayName.includes('Beacon') || r.name === 'STAJ22001') {
      cleanDisplayName = 'STAJ22001 — Staj Dosyası & Projeleri';
    }

    return {
      slug: (r.name || '').toLowerCase(),
      name: r.name,
      display_name: cleanDisplayName,
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
    };
  })
  .sort((a, b) => {
    const timeA = new Date(a.created_at || a.pushed_at || a.updated_at || 0).getTime();
    const timeB = new Date(b.created_at || b.pushed_at || b.updated_at || 0).getTime();
    return timeB - timeA;
  });

/**
 * Projeleri önce backend'den, backend yoksa doğrudan GitHub API'sinden canlı çeker;
 * Ağ yoksa veya limit dolmuşsa 0ms'de yerel snapshot ile besler.
 */
export async function fetchProjects(refresh: boolean = false): Promise<ProjectsListResponse> {
  const endpoints = [
    `${API_BASE_URL}/api/projects${refresh ? '?refresh=true' : ''}`,
    `http://127.0.0.1:8000/api/projects${refresh ? '?refresh=true' : ''}`,
  ];

  for (const endpoint of endpoints) {
    if (!endpoint || endpoint.startsWith('/api') && !API_BASE_URL) continue;
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
      // Bir sonraki yöntemi dene
    }
  }

  // Backend kapalıysa (örneğin Vercel frontend sunumu), doğrudan GitHub API'sinden canlı depoları çek
  try {
    const ghRes = await fetch('https://api.github.com/users/omerabali/repos?sort=pushed&per_page=100', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (ghRes.ok) {
      const ghRepos: any[] = await ghRes.json();
      if (Array.isArray(ghRepos) && ghRepos.length > 0) {
        const localMap = new Map<string, Project>();
        for (const lp of mappedLocalRepos) {
          localMap.set(lp.name.toLowerCase(), lp);
        }

        const merged: Project[] = ghRepos.map((r) => {
          const local = localMap.get(r.name.toLowerCase());
          let cleanDisplayName = local?.display_name || r.name;
          if (cleanDisplayName.includes('Beacon') || r.name === 'STAJ22001') {
            cleanDisplayName = 'STAJ22001 — Staj Dosyası & Projeleri';
          }

          return {
            slug: (r.name || '').toLowerCase(),
            name: r.name,
            display_name: cleanDisplayName,
            description: local?.description || r.description || null,
            readme_h1: local?.readme_h1 || null,
            readme_detail: local?.readme_detail || null,
            readme_summary: local?.readme_summary || null,
            readme_raw: local?.readme_raw || null,
            readme_html: local?.readme_html || null,
            image_url: local?.image_url || `https://opengraph.githubassets.com/1/omerabali/${r.name}`,
            tech_stack: local?.tech_stack || (r.language ? [r.language] : []),
            features: local?.features || [],
            category: local?.category || 'Yazılım',
            languages: local?.languages || (r.language ? { [r.language]: 100 } : {}),
            github_url: r.html_url || `https://github.com/omerabali/${r.name}`,
            homepage: r.homepage || local?.homepage || null,
            stars: r.stargazers_count ?? local?.stars ?? 0,
            forks: r.forks_count ?? local?.forks ?? 0,
            open_issues: r.open_issues_count ?? 0,
            topics: r.topics || local?.topics || [],
            is_showcased: local?.is_showcased ?? false,
            created_at: r.created_at || local?.created_at || new Date().toISOString(),
            updated_at: r.updated_at || local?.updated_at || new Date().toISOString(),
            pushed_at: r.pushed_at || local?.pushed_at || null,
          };
        }).sort((a, b) => {
          const timeA = new Date(a.created_at || a.pushed_at || a.updated_at || 0).getTime();
          const timeB = new Date(b.created_at || b.pushed_at || b.updated_at || 0).getTime();
          return timeB - timeA;
        });

        return {
          total: merged.length,
          showcased_count: merged.filter((p) => p.is_showcased).length,
          cached: false,
          data: merged,
        };
      }
    }
  } catch {
    // GitHub API fallback
  }

  // Tamamen çevrimdışı veya rate-limit durumunda önceden derlenmiş yerel snapshot'a düş
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
    if (!endpoint || endpoint.startsWith('/api') && !API_BASE_URL) continue;
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

  let rawReadme = localMatch?.readme_raw || localMatch?.readme_detail || null;

  // Eğer yerel eşleşmede README yoksa, GitHub Raw üzerinden canlı çekmeyi dene
  if (!rawReadme && localMatch) {
    for (const branch of ['main', 'master']) {
      try {
        const rawRes = await fetch(`https://raw.githubusercontent.com/omerabali/${localMatch.name}/${branch}/README.md`);
        if (rawRes.ok) {
          rawReadme = await rawRes.text();
          break;
        }
      } catch {
        // Sonraki branch
      }
    }
  }

  if (localMatch) {
    return {
      ...localMatch,
      readme_raw: rawReadme,
      readme_detail: rawReadme,
      readme_html: null,
      default_branch: 'main',
      license: 'MIT',
      archived: false,
    };
  }

  return null;
}
