import React, { useEffect, useState } from 'react';
import { useInView } from '../../lib/hooks/useInView';
import { usePrefersReducedMotion } from '../../lib/hooks/usePrefersReducedMotion';

interface CountUpProps {
  end: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Sayaç yalnızca ekrana girdiğinde çalışır ve
 * "hareketi azalt" tercihinde doğrudan son değeri gösterir.
 */
export const CountUp: React.FC<CountUpProps> = ({
  end,
  decimals = 0,
  suffix = '',
  duration = 1100,
}) => {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const prefersReduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (prefersReduced) {
      setValue(end);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(end * easeOutExpo(progress));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, end, duration, prefersReduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};
