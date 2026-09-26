import React from 'react';

interface MarqueeProps {
  items?: string[];
}

const DEFAULT_ITEMS = [
  'PYTHON • C# • JAVA • TYPESCRIPT • DART',
  'YAPAY ZEKA & MAKİNE ÖĞRENMESİ (AI / ML)',
  'REACT & TAILWINDCSS FULL-STACK',
  'FLUTTER & KOTLIN MOBİL GELİŞTİRME',
  'GENERATIVE AI & COMPUTER VISION',
  'DOCKER, AWS & WEBSOCKET REAL-TIME',
  'POSTGRESQL, MYSQL & FIREBASE',
  'CLEAN ARCHITECTURE & SAAS SİSTEMLERİ',
];

export const Marquee: React.FC<MarqueeProps> = ({ items = DEFAULT_ITEMS }) => {
  // Kesintisiz döngü için diziyi 3 kez tekrarla
  const repeated = [...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden border-y border-rule bg-surface/40 py-5 backdrop-blur-md">
      {/* Sol & Sağ Yumuşak Geçiş Maskeleri */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-paper to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-paper to-transparent sm:w-40" />

      {/* Büyük Editoryal Kayan Şerit */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {repeated.map((item, idx) => (
          <div
            key={idx}
            className="mx-6 flex items-center gap-6 font-display text-xl sm:text-2xl lg:text-3xl font-black tracking-widest uppercase text-ink/80 transition-colors hover:text-accent"
          >
            <span>{item}</span>
            <span className="inline-block h-2 w-2 rounded-full bg-accent/60 shadow-[0_0_10px_var(--color-accent)]" />
          </div>
        ))}
      </div>
    </div>
  );
};
