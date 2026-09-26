import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }[size];

  return (
    <div
      className={`group relative flex items-center justify-center select-none perspective-500 cursor-pointer ${className}`}
      style={{ perspective: 600 }}
    >
      {/* 360 Derece Kendi Etrafında Dönen Şeffaf 3D Monogram Logo */}
      <img
        src="/logo-3d-transparent.png"
        alt="ÖA Logo"
        className={`${dimensions} object-contain filter drop-shadow-xs transition-all duration-700 ease-in-out group-hover:[transform:rotateY(360deg)_scale(1.1)] group-hover:drop-shadow-md`}
        style={{ transformStyle: 'preserve-3d' }}
      />
    </div>
  );
};
