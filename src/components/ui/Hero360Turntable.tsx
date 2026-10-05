import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '../../lib/i18n/LanguageContext';

export const Hero360Turntable: React.FC = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  // 360° Physics and Rotation States
  const [rotation, setRotation] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, rotation: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const velocityRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const isInteractingRef = useRef(false);

  // Physics Loop (Idle Auto-rotation + Momentum friction decay)
  useEffect(() => {
    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = currentTime;

      if (!isInteractingRef.current) {
        if (Math.abs(velocityRef.current) > 0.02) {
          setRotation((prev) => {
            const next = (prev + velocityRef.current) % 360;
            return next < 0 ? next + 360 : next;
          });
          velocityRef.current *= 0.94; // friction
        } else {
          // Gentle idle rotation ~0.3 rpm
          setRotation((prev) => (prev + 8 * dt) % 360);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Scroll-linked rotation
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (isDragging) return;
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (Math.abs(delta) > 0.5) {
        setRotation((prev) => (prev + delta * 0.35 + 36000) % 360);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDragging]);

  // Mouse & Touch Dragging
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    isInteractingRef.current = true;
    velocityRef.current = 0;
    setDragStart({ x: clientX, rotation });
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStart.x;
    const instantVelocity = (deltaX * 0.7 - (rotation - dragStart.rotation)) * 0.2;
    velocityRef.current = instantVelocity;

    const newRot = (dragStart.rotation + deltaX * 0.7 + 360000) % 360;
    setRotation(newRot);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    isInteractingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = -(y / (rect.height / 2)) * 6;
    const tiltY = (x / (rect.width / 2)) * 8;
    setTilt({ x: Number(tiltX.toFixed(1)), y: Number(tiltY.toFixed(1)) });

    if (isDragging) {
      handleDragMove(e.clientX);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) handleDragEnd();
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (isDragging) handleDragEnd();
        setTilt({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[calc(100svh-5rem)] flex flex-col justify-start lg:justify-center overflow-x-hidden px-6 sm:px-10 lg:px-16 pt-6 pb-10 sm:py-12 lg:py-16 transition-colors duration-300 select-text"
      style={{ perspective: 1800 }}
    >
      {/* -------------------------------------------------------------------
          1. ZARİF STÜDYO AMBİYANS IŞIĞI (Aydınlık & Karanlık Mod Uyumlu)
      ------------------------------------------------------------------- */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-accent/6 via-transparent to-transparent opacity-80" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[650px] w-[650px] rounded-full bg-accent/4 blur-[100px]" />

      {/* -------------------------------------------------------------------
          2. ASİMETRİK EDİTORYAL YERLEŞİM (Ömer Abalı Gerçek Kimliği)
      ------------------------------------------------------------------- */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center w-full max-w-[1520px] mx-auto lg:flex-1 lg:my-auto">
        
        {/* SOL KOLON (7 Kolon): Ömer Abalı Unvanı & Özellikleri */}
        <div className="lg:col-span-7 flex flex-col items-start text-left pointer-events-auto select-text">
          {/* Şık, Minimal Editoryal Rozet */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-rule-strong/70 bg-surface/90 text-ink mb-3 sm:mb-4 shadow-2xs backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
            <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-ink">
              {t.hero.greetingBadge}
            </span>
          </div>

          {/* Gerçek Unvan */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-ink uppercase leading-[0.92]">
            {t.hero.titleMain}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink via-accent to-accent-deep">
              {t.hero.titleAccent}
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-base text-ink-2 leading-relaxed font-medium select-text">
            {t.hero.bio}
          </p>

          {/* Eylem Butonları — mobilde portreden önce görünür kalsın */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2.5 rounded-full bg-ink px-6 sm:px-7 py-3 sm:py-3.5 font-display text-xs sm:text-sm font-bold text-paper shadow-xl hover:opacity-90 active:scale-98 transition-all"
            >
              <span>{t.hero.ctaProjects}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-rule-strong bg-surface/70 px-5 sm:px-6 py-3 sm:py-3.5 font-display text-xs sm:text-sm font-bold text-ink hover:border-ink hover:bg-surface active:scale-98 transition-all shadow-xs"
            >
              <span>{t.hero.ctaContact}</span>
            </Link>
          </div>
        </div>

        {/* SAĞ KOLON (5 Kolon): Temiz ve Sade 360° Portre */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end relative mt-2 sm:mt-4 lg:my-0">
          <div
            className="relative flex items-center justify-center transition-transform duration-100 ease-out cursor-grab active:cursor-grabbing select-none"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
              transformStyle: 'preserve-3d',
            }}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseUp={handleDragEnd}
            onTouchStart={(e) => {
              if (e.touches.length === 1) handleDragStart(e.touches[0].clientX);
            }}
            onTouchMove={(e) => {
              if (e.touches.length === 1 && isDragging) handleDragMove(e.touches[0].clientX);
            }}
            onTouchEnd={handleDragEnd}
          >
            {/* Portre — mobilde daha kompakt; CTA'ları ezmesin */}
            <div className="relative h-[220px] sm:h-[360px] lg:h-[480px] xl:h-[520px] max-h-[540px] aspect-square flex items-center justify-center overflow-visible">
              <picture>
                <source srcSet="/profile-avatar-studio.webp" type="image/webp" />
                <img
                  src="/profile-avatar-studio-sm.png"
                  alt="Ömer Abalı — Portre"
                  width={1040}
                  height={1040}
                  decoding="async"
                  fetchPriority="high"
                  loading="eager"
                  className="h-full w-full object-contain pointer-events-none transition-transform duration-75 ease-out drop-shadow-[0_20px_35px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_25px_45px_rgba(0,0,0,0.8)]"
                  style={{
                    transform: `translateX(${Math.sin((rotation * Math.PI) / 180) * 14}px) scale(1.04)`,
                    filter: `contrast(${1.01 + Math.abs(Math.sin((rotation * Math.PI) / 180)) * 0.05})`,
                  }}
                />
              </picture></div>
          </div>
        </div>
      </div>
    </div>
  );
};
