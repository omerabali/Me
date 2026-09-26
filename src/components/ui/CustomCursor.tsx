import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mobil veya dokunmatik cihazlarda özel imleci devre dışı bırak
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Hedef elementi kontrol et
      const target = e.target as HTMLElement | null;
      const cursorTarget = target?.closest('[data-cursor]') as HTMLElement | null;
      const isInteractive = target?.closest('a, button, [role="button"], input, textarea, select');

      if (cursorTarget) {
        const type = cursorTarget.getAttribute('data-cursor');
        if (type === 'view') {
          setCursorText('VIEW');
          setIsHovered(true);
        } else if (type === 'explore') {
          setCursorText('360°');
          setIsHovered(true);
        } else {
          setCursorText(null);
          setIsHovered(true);
        }
      } else if (isInteractive) {
        setCursorText(null);
        setIsHovered(true);
      } else {
        setCursorText(null);
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Yumuşak takip döngüsü (Lerp)
    const render = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Merkez Nokta */}
      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed top-0 left-0 z-100 -ml-1 -mt-1 h-2 w-2 rounded-full bg-accent transition-opacity duration-200"
        style={{
          opacity: cursorText ? 0 : 1,
        }}
      />

      {/* Dış Halka / Etkileşim Balonu */}
      <div
        ref={cursorRingRef}
        className={`pointer-events-none fixed top-0 left-0 z-99 flex items-center justify-center rounded-full border transition-all duration-150 ease-out ${
          cursorText
            ? '-ml-8 -mt-8 h-16 w-16 border-accent/80 bg-accent/20 backdrop-blur-xs text-[10px] font-mono font-bold tracking-wider text-accent'
            : isHovered
            ? '-ml-5 -mt-5 h-10 w-10 border-accent/70 bg-accent/10 backdrop-blur-2xs'
            : '-ml-4 -mt-4 h-8 w-8 border-rule-strong/70 bg-transparent'
        }`}
      >
        {cursorText && <span>{cursorText}</span>}
      </div>
    </>
  );
};
