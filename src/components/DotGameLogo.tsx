import React from 'react';

interface DotGameLogoProps {
  size?: number | 'sm' | 'md' | 'lg';
  className?: string;
  glow?: boolean;
}

export function DotGameLogo({ size = 'md', className = '', glow = true }: DotGameLogoProps) {
  let width = 36;
  let height = 36;
  if (typeof size === 'number') {
    width = size;
    height = size;
  } else if (size === 'sm') {
    width = 24;
    height = 24;
  } else if (size === 'md') {
    width = 36;
    height = 36;
  } else if (size === 'lg') {
    width = 48;
    height = 48;
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="dotGameGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d4d4d8" />
        </linearGradient>
        <radialGradient id="purpleDotGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="60%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7e22ce" />
        </radialGradient>
        {glow && (
          <filter id="purpleGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* Background Rounded Diamond Shield */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="22"
        fill="#0b0f19"
        stroke="#27272a"
        strokeWidth="3.5"
      />
      <rect
        x="8"
        y="8"
        width="84"
        height="84"
        rx="20"
        fill="none"
        stroke="url(#purpleDotGlow)"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />

      {/* Electric Purple Dot */}
      <circle
        cx="24"
        cy="52"
        r="7.5"
        fill="url(#purpleDotGlow)"
        filter={glow ? 'url(#purpleGlowFilter)' : undefined}
      />
      <circle cx="24" cy="52" r="3" fill="#ffffff" fillOpacity="0.75" />

      {/* Stylized Bold Gaming Text "G" */}
      <path
        d="M 44 40 C 44 35 48 33 54 33 C 62 33 67 36 67 42 L 59 42 C 59 39 57 38 54 38 C 50 38 48 40 48 50 C 48 60 50 62 54 62 C 58 62 60 60 60 56 L 54 56 L 54 51 L 67 51 L 67 67 C 63 69 58 70 53 70 C 46 70 44 65 44 59 Z"
        fill="url(#dotGameGrad)"
      />

      {/* Letter Accent Tag Line */}
      <path
        d="M 72 38 L 82 38 L 82 66 L 72 66"
        stroke="#a855f7"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="77" cy="52" r="2" fill="#c084fc" />
    </svg>
  );
}

export function DotGameLogoFull({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 select-none font-sans font-black tracking-wider ${className}`}>
      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7] animate-pulse inline-block" />
      <span className="text-white text-base tracking-tight font-extrabold uppercase">
        GAME
      </span>
    </div>
  );
}
export default DotGameLogo;
