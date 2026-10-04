/**
 * URL Çözümleyici (URL Resolver)
 * 
 * DB'deki ham markdown asla değiştirilmez. Dönüşüm sadece render anında yapılır.
 * Çözümleme için repo_name ve context (owner, repo) kullanılır.
 */

export interface ResolveContext {
  owner?: string;
  repo: string;
}

export type UrlKind = 'image' | 'link';

const DEFAULT_OWNER = 'omerabali';

/**
 * Göreli veya mutlak path'i normalize eder (.. ve . çözümü).
 * Repo kökünden yukarı çıkılması engellenir.
 */
export function normalizeRepoPath(path: string): string {
  // Baştaki slash veya ./ işaretlerini temizle
  let clean = path.replace(/^\.?\/+/, '');

  // Parçalara ayır
  const segments = clean.split('/');
  const stack: string[] = [];

  for (const seg of segments) {
    if (!seg || seg === '.') continue;
    if (seg === '..') {
      if (stack.length > 0) {
        stack.pop();
      }
      // stack boşsa repo kökünün dışına çıkamaz, yoksayılır
    } else {
      stack.push(seg);
    }
  }

  // Segmentleri encode et (zaten encode edilmiş olanları çift encode yapmadan)
  const encodedSegments = stack.map((seg) => {
    try {
      const decoded = decodeURIComponent(seg);
      return encodeURIComponent(decoded);
    } catch {
      return encodeURIComponent(seg);
    }
  });

  return encodedSegments.join('/');
}

/**
 * Göreli resimler için jsDelivr ve raw.githubusercontent fallback URL'lerini üretir.
 */
export function getImageFallbackUrls(url: string, ctx: ResolveContext): { primary: string; fallback: string } | null {
  const trimmed = url.trim();
  const owner = ctx.owner || DEFAULT_OWNER;
  const repo = ctx.repo;

  // Mutlak link veya data URI ise fallback zinciri gerekmez
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(trimmed)) {
    return null;
  }

  const cleanPath = normalizeRepoPath(trimmed);
  return {
    primary: `https://cdn.jsdelivr.net/gh/${owner}/${repo}/${cleanPath}`,
    fallback: `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${cleanPath}`,
  };
}

/**
 * resolveUrl
 * Resim ve link URL'lerini GitHub / CDN kurallarına göre çözümler.
 */
export function resolveUrl(url: string, kind: UrlKind, ctx: ResolveContext): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  const owner = ctx.owner || DEFAULT_OWNER;
  const repo = ctx.repo;

  // 1. javascript: veya vbscript: gibi tehlikeli URI'leri tamamen engelle
  if (/^(javascript|vbscript):/i.test(trimmed)) {
    return '#';
  }

  // 2. data: URI kontrolü
  if (/^data:/i.test(trimmed)) {
    if (kind === 'image') {
      // Yalnızca image/png, image/jpeg, image/jpg, image/gif, image/webp izin ver
      // svg+xml data URI engellenir (XSS önleme)
      if (/^data:image\/(png|jpeg|jpg|gif|webp);base64,/i.test(trimmed)) {
        return trimmed;
      }
    }
    return '';
  }

  // 3. Protokolsüz URL //host/... -> https: ekle
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  // 4. Sayfa içi anchor (#anchor)
  if (trimmed.startsWith('#')) {
    return trimmed;
  }

  // 5. mailto: linki
  if (/^mailto:/i.test(trimmed)) {
    return trimmed;
  }

  // 6. Mutlak http / https URL'leri
  if (/^https?:\/\//i.test(trimmed)) {
    if (kind === 'image') {
      // github.com/{owner}/{repo}/blob/{ref}/{path}?raw=true veya blob/... -> raw.githubusercontent.com'a çevir
      const blobMatch = trimmed.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/i);
      if (blobMatch) {
        const bOwner = blobMatch[1];
        const bRepo = blobMatch[2];
        const bRef = blobMatch[3];
        let bPath = blobMatch[4].replace(/\?raw=true$/i, '');
        return `https://raw.githubusercontent.com/${bOwner}/${bRepo}/${bRef}/${bPath}`;
      }

      // shields.io, user-attachments, githubusercontent veya başka bir mutlak URL -> olduğu gibi bırak
      return trimmed;
    }

    // Link ise mutlak URL olduğu gibi kalır
    return trimmed;
  }

  // 7. Göreli Yollar (docs/a.png, ./docs/a.png, /docs/a.png, ../a.png vb.)
  const cleanPath = normalizeRepoPath(trimmed);

  if (kind === 'image') {
    // jsDelivr birincil CDN
    return `https://cdn.jsdelivr.net/gh/${owner}/${repo}/${cleanPath}`;
  }

  // kind === 'link' göreli dosya linki (docs/KURULUM.md, ./LICENSE vb.)
  return `https://github.com/${owner}/${repo}/blob/HEAD/${cleanPath}`;
}
