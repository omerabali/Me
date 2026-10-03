// src/lib/github.ts
export const USER = "omerabali";

const README_CACHE_PREFIX = "gh_readme_cache_";

/**
 * 1. Repoları canlı GitHub API'sinden çeker.
 * En son güncellenen repolar en başta gelir.
 */
export async function fetchRepos() {
  const res = await fetch(
    `https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`
  );
  if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
  const repos = await res.json();
  return repos.filter((r: any) => !r.fork); // istersen forkları ele
}

/**
 * 2. README'yi çeker.
 * GitHub'ın hazır /readme endpoint'i README.md, readme.md ya da README.rst'yi otomatik bulur.
 * application/vnd.github.raw+json ile doğrudan markdown metni gelir.
 * Lazy fetch ve sessionStorage önbelleği ile rate-limit korunur.
 */
export async function fetchReadme(repo: string): Promise<string | null> {
  const cacheKey = `${README_CACHE_PREFIX}${repo.toLowerCase()}`;

  // Önce sessionStorage önbelleğini kontrol et
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached !== null) {
      return cached || null;
    }
  } catch {
    // sessionStorage erişilemezse devam et
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${USER}/${repo}/readme`,
      { headers: { Accept: "application/vnd.github.raw+json" } }
    );

    if (res.status === 404) {
      // README'si olmayan repo
      try {
        sessionStorage.setItem(cacheKey, "");
      } catch {}
      return null;
    }

    if (!res.ok) {
      // Rate limit (403) veya API hatasında GitHub Raw fallback dene
      const rawRes = await fetch(
        `https://raw.githubusercontent.com/${USER}/${repo}/HEAD/README.md`
      );
      if (rawRes.ok) {
        const text = await rawRes.text();
        try {
          sessionStorage.setItem(cacheKey, text);
        } catch {}
        return text;
      }
      throw new Error(`GitHub API: ${res.status}`);
    }

    const text = await res.text();
    try {
      sessionStorage.setItem(cacheKey, text);
    } catch {}
    return text;
  } catch (err) {
    // Ağ veya rate limit durumunda Raw URL'den dene
    try {
      const rawRes = await fetch(
        `https://raw.githubusercontent.com/${USER}/${repo}/HEAD/README.md`
      );
      if (rawRes.ok) {
        const text = await rawRes.text();
        try {
          sessionStorage.setItem(cacheKey, text);
        } catch {}
        return text;
      }
    } catch {}
    console.warn(`README could not be fetched for ${repo}:`, err);
    return null;
  }
}
