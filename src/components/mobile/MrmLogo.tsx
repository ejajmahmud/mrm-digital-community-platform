import React from 'react';

interface MrmLogoProps {
  className?: string;
  height?: number;
}

/**
 * Official Multiracial Reverted Muslims (MRM) Logo
 * Exact geometric vector reproduction of logo.png:
 * - Left 'M' in Cyan-Blue (#1FA2E8): Two pointed Islamic arches with 3 vertical legs
 * - Middle 'R' in Golden-Yellow (#F3C71E): Pointed arch top, inward horizontal point, vertical right leg
 * - Right 'M' in Mint-Emerald (#67C792): Pointed Islamic double-arch with 2 vertical legs
 */
export const MrmLogo: React.FC<MrmLogoProps> = ({
  className = '',
  height = 28,
}) => {
  const width = Math.round(height * 2.75);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 440 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      role="img"
      aria-label="MRM Multiracial Reverted Muslims Official Logo"
    >
      {/* ================================================================= */}
      {/* 1. LEFT CYAN-BLUE 'M' (#1FA2E8)                                   */}
      {/* ================================================================= */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="
          M 10 154
          L 10 86
          C 10 48 35 21 68 6
          L 72 4
          L 76 6
          C 90 12 103 21 112 32
          C 121 21 134 12 148 6
          L 152 4
          L 156 6
          C 189 21 214 48 214 86
          L 214 154
          L 192 154
          L 192 86
          C 192 57 173 35 152 25
          C 134 34 123 51 123 86
          L 123 154
          L 101 154
          L 101 86
          C 101 57 89 35 72 25
          C 51 35 32 57 32 86
          L 32 154
          Z
        "
        fill="#1FA2E8"
      />

      {/* ================================================================= */}
      {/* 2. MIDDLE GOLDEN-YELLOW 'R' (#F3C71E)                             */}
      {/* ================================================================= */}
      <path
        d="
          M 196 32
          C 208 20 222 11 236 5
          L 240 3.5
          L 244 5
          C 274 19 294 44 294 74
          C 294 94 283 108 266 115
          C 280 123 288 135 288 154
          L 266 154
          C 266 133 254 121 220 113
          L 186 105
          L 220 98
          C 256 91 272 84 272 72
          C 272 52 258 35 240 25
          C 228 31 218 40 211 50
          Z
        "
        fill="#F3C71E"
      />

      {/* ================================================================= */}
      {/* 3. RIGHT MINT-EMERALD 'M' (#67C792)                               */}
      {/* ================================================================= */}
      <path
        d="
          M 272 29
          C 284 18 298 10 312 4.5
          L 316 3
          L 320 4.5
          C 334 11 346 20 355 31
          C 364 20 376 11 390 4.5
          L 394 3
          L 398 4.5
          C 422 16 436 44 436 86
          L 436 154
          L 414 154
          L 414 86
          C 414 56 402 35 391 25
          C 374 34 366 53 366 86
          L 366 154
          L 344 154
          L 344 86
          C 344 56 333 35 316 25
          C 304 31 294 40 287 50
          Z
        "
        fill="#67C792"
      />
    </svg>
  );
};

export const MrmLogoBadge: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const dimensions =
    size === 'sm'
      ? 'h-9 px-2 rounded-xl'
      : size === 'lg'
      ? 'h-16 px-4 rounded-2xl'
      : 'h-11 px-2.5 rounded-xl';
  const logoHeight = size === 'sm' ? 20 : size === 'lg' ? 36 : 24;

  return (
    <div
      className={`inline-flex items-center justify-center bg-white border border-slate-200/90 shadow-2xs shrink-0 ${dimensions} ${className}`}
    >
      <MrmLogo height={logoHeight} />
    </div>
  );
};
