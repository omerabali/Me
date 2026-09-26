import React, { useRef, useState } from 'react';
import { Code2, Layers } from 'lucide-react';

export const Hero3DCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 10, y: 5 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Maksimum ±14 derece hassas ve pürüzsüz 3D eğim
    const rotX = -(y / (rect.height / 2)) * 14;
    const rotY = (x / (rect.width / 2)) * 14;

    setRotate({
      x: Number(rotX.toFixed(1)),
      y: Number(rotY.toFixed(1)),
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const formatDeg = (deg: number) => (deg >= 0 ? `+${deg}°` : `${deg}°`);

  return (
    <div
      className="relative w-full max-w-md cursor-pointer select-none"
      style={{ perspective: 1200 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Dönen Ana Taşıyıcı Kart */}
      <div
        ref={cardRef}
        className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-rule bg-linear-to-br from-surface to-paper-sunk p-8 shadow-2xl transition-all"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Arka Plan Yumuşak Radyal Işık */}
        <div className="pointer-events-none absolute inset-0 bg-radial from-accent/15 via-transparent to-transparent opacity-80" />

        {/* 1. KATMAN: Sol Üst Canlı 3D Koordinat Etiketi (Derinlik: 45px) */}
        <div
          className="absolute top-4 left-4 z-30 flex items-center gap-2 rounded-xl border border-rule/80 bg-surface/85 px-3 py-1.5 text-[11px] font-mono font-semibold text-ink-3 shadow-xs backdrop-blur-md transition-transform"
          style={{
            transform: 'translateZ(45px)',
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span>
            3D POS: {formatDeg(rotate.x)} / {formatDeg(rotate.y)}
          </span>
        </div>

        {/* 2. KATMAN: Sağ Üst Full-Stack Rozeti (Derinlik: 70px) */}
        <div
          className="glass-badge absolute top-12 right-4 z-40 flex items-center gap-2.5 rounded-2xl p-3 shadow-lg transition-transform hover:scale-105"
          style={{
            transform: 'translateZ(70px)',
          }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Code2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink">Full-Stack</p>
            <p className="text-[10px] font-medium tracking-wide text-ink-3 uppercase">
              WEB & CLOUD
            </p>
          </div>
        </div>

        {/* 3. KATMAN: Merkez Saf 3D ÖA Logo Monogram Görseli (Derinlik: 35px) */}
        <div
          className="my-7 flex items-center justify-center transition-transform duration-300"
          style={{
            transform: isHovered ? 'translateZ(50px) scale(1.04)' : 'translateZ(35px)',
          }}
        >
          <img
            src="/logo-3d-transparent.png"
            alt="ÖA 3D Monogram Logo"
            className="h-44 w-44 object-contain drop-shadow-2xl select-none pointer-events-none"
            loading="eager"
          />
        </div>

        {/* 4. KATMAN: Sağ Alt Engineering Rozeti (Derinlik: 70px) */}
        <div
          className="glass-badge absolute right-4 bottom-14 z-40 flex items-center gap-2.5 rounded-2xl p-3 shadow-lg transition-transform hover:scale-105"
          style={{
            transform: 'translateZ(70px)',
          }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-positive/15 text-positive">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink">Engineering</p>
            <p className="text-[10px] font-medium tracking-wide text-ink-3 uppercase">
              SYSTEMS & SCALE
            </p>
          </div>
        </div>

        {/* 5. KATMAN: Alt Merkez Durum Rozeti (Derinlik: 45px) */}
        <div
          className="z-30 mt-2 flex items-center gap-2 rounded-full border border-rule/80 bg-surface/90 px-4 py-1.5 text-xs font-mono font-semibold text-ink shadow-xs backdrop-blur-md"
          style={{
            transform: 'translateZ(45px)',
          }}
        >
          <span className="h-2 w-2 rounded-full bg-positive" />
          <span>SYS: OPTIMAL</span>
        </div>
      </div>
    </div>
  );
};
