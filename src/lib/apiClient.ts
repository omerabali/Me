import type { AdminProject, Project, ProjectDetail } from '../types/project';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function getCsrfTokenFromCookie(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|;\s*)admin_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

function adminJsonHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const csrf = getCsrfTokenFromCookie();
  if (csrf) {
    headers['X-CSRF-Token'] = csrf;
  }
  return headers;
}

/**
 * Public: Yayındaki tüm projeleri listeler (README gövdesi hariç, has_readme dahil)
 */
export async function fetchPublicProjects(): Promise<Project[]> {
  const url = `${API_BASE}/api/projects`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`API hatası: ${res.status}`);
  }

  const rawList = await res.json();
  return rawList.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.repo_name || p.slug,
    repo_name: p.repo_name,
    display_name: p.title_tr,
    title_tr: p.title_tr,
    title_en: p.title_en,
    description: p.description_tr,
    description_tr: p.description_tr,
    description_en: p.description_en,
    category: p.category,
    tech_stack: p.tags || [],
    tags: p.tags || [],
    features: [],
    github_url: p.github_url,
    demo_url: p.demo_url,
    homepage: p.demo_url,
    cover_image_url: p.cover_image_url,
    image_url: p.cover_image_url,
    stars: p.stars || 0,
    forks: p.forks || 0,
    topics: p.tags || [],
    has_readme: p.has_readme,
    sort_order: p.sort_order,
    is_published: true,
    updated_at: p.updated_at,
    created_at: p.updated_at,
  }));
}

/**
 * Public: Belirli bir projenin detayını ve tam ham README içeriğini getirir
 */
export async function fetchPublicProjectDetail(slug: string): Promise<ProjectDetail | null> {
  const url = `${API_BASE}/api/projects/${encodeURIComponent(slug.toLowerCase())}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Detay alınamadı: ${res.status}`);
  }

  const p = await res.json();
  return {
    id: p.id,
    slug: p.slug,
    name: p.repo_name || p.slug,
    repo_name: p.repo_name,
    display_name: p.title_tr,
    title_tr: p.title_tr,
    title_en: p.title_en,
    description: p.description_tr,
    description_tr: p.description_tr,
    description_en: p.description_en,
    category: p.category,
    tech_stack: p.tags || [],
    tags: p.tags || [],
    features: [],
    github_url: p.github_url,
    demo_url: p.demo_url,
    homepage: p.demo_url,
    cover_image_url: p.cover_image_url,
    image_url: p.cover_image_url,
    stars: p.stars || 0,
    forks: p.forks || 0,
    topics: p.tags || [],
    has_readme: p.has_readme,
    readme_markdown: p.readme_markdown,
    readme_raw: p.readme_markdown,
    readme_updated_at: p.readme_updated_at,
    sort_order: p.sort_order,
    is_published: true,
    updated_at: p.updated_at,
  };
}

// ---------------- Admin API ----------------

/**
 * Admin: Oturum durumunu sorgular
 */
export async function checkAdminAuth(): Promise<{ authenticated: boolean; username: string }> {
  const res = await fetch(`${API_BASE}/api/admin/auth/me`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  if (res.ok) {
    const data = await res.json();
    return { authenticated: data.authenticated, username: data.username };
  }
  return { authenticated: false, username: '' };
}

/**
 * Admin: Giriş yap
 */
export async function loginAdmin(password: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/admin/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: adminJsonHeaders(),
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Giriş başarısız' }));
    throw new Error(err.detail || 'Giriş başarısız.');
  }
  return true;
}

/**
 * Admin: Çıkış yap
 */
export async function logoutAdmin(): Promise<void> {
  await fetch(`${API_BASE}/api/admin/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: adminJsonHeaders(),
  });
}

/**
 * Admin: Tüm projeleri listele
 */
export async function fetchAdminProjects(): Promise<AdminProject[]> {
  const res = await fetch(`${API_BASE}/api/admin/projects`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Admin projeleri yüklenemedi: ${res.status}`);
  }
  return res.json();
}

/**
 * Admin: Proje oluştur
 */
export async function createAdminProject(data: Partial<AdminProject>): Promise<AdminProject> {
  const res = await fetch(`${API_BASE}/api/admin/projects`, {
    method: 'POST',
    credentials: 'include',
    headers: adminJsonHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Oluşturulamadı' }));
    throw new Error(err.detail || 'Proje oluşturulamadı.');
  }
  return res.json();
}

/**
 * Admin: Proje güncelle
 */
export async function updateAdminProject(id: number, data: Partial<AdminProject>): Promise<AdminProject> {
  const res = await fetch(`${API_BASE}/api/admin/projects/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: adminJsonHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Güncellenemedi' }));
    throw new Error(err.detail || 'Proje güncellenemedi.');
  }
  return res.json();
}

/**
 * Admin: Proje sil
 */
export async function deleteAdminProject(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/projects/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: adminJsonHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Silinemedi' }));
    throw new Error(err.detail || 'Proje silinemedi.');
  }
}

/**
 * Admin: Sıralama güncelle
 */
export async function reorderAdminProjects(items: { id: number; sort_order: number }[]): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/projects/reorder`, {
    method: 'PUT',
    credentials: 'include',
    headers: adminJsonHeaders(),
    body: JSON.stringify({ items }),
  });
  if (!res.ok) {
    throw new Error('Sıralama güncellenemedi.');
  }
}

/**
 * Admin: GitHub'dan form alanlarını tek seferlik otomatik doldur (README çekmez)
 */
export async function importGitHubMeta(repoName: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/admin/projects/import-github-meta/${encodeURIComponent(repoName.trim())}`, {
    method: 'POST',
    credentials: 'include',
    headers: adminJsonHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'GitHub bilgileri alınamadı.' }));
    throw new Error(err.detail || 'GitHub bilgileri alınamadı.');
  }
  return res.json();
}
