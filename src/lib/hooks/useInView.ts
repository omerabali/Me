import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  /** Görünürlük eşiği (0–1). */
  threshold?: number;
  /** Viewport kenar payı — öğe alttan girerken erken tetikler. */
  rootMargin?: string;
  /** true ise yalnızca ilk girişte tetiklenir (varsayılan). */
  once?: boolean;
}

/**
 * Öğe viewport'a girdiğinde `true` döner.
 *
 * Mevcut kurulumdaki temel sorun, animasyonların sayfa yüklenir yüklenmez
 * çalışmasıydı; sayfanın altındaki bölümler kullanıcı oraya varmadan
 * animasyonunu bitiriyordu. Bu hook animasyonu gerçek scroll konumuna bağlar.
 *
 * IntersectionObserver desteklenmiyorsa içerik doğrudan görünür kabul edilir.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
