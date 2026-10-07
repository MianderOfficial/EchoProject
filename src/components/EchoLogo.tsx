import React from 'react';

interface EchoLogoProps {
  size?: number | string;
  showText?: boolean;
  withRipples?: boolean;
  className?: string;
  variant?: 'color' | 'mono-white' | 'mono-dark';
}

export const EchoLogo: React.FC<EchoLogoProps> = ({
  size = 40,
  showText = false,
  withRipples = false,
  className = '',
  variant = 'color',
}) => {
  const numericSize = typeof size === 'number' ? size : parseInt(String(size), 10) || 40;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center shrink-0" style={{ width: numericSize, height: numericSize }}>
        {/* Subtle acoustic radiating ripples if enabled */}
        {withRipples && (
          <div className="absolute inset-0 pointer-events-none">
            <span
              className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping opacity-60"
              style={{ animationDuration: '3s' }}
            />
            <span
              className="absolute -inset-2 rounded-full border border-cyan-300/20 animate-pulse"
            />
          </div>
        )}

        <svg
          viewBox="0 0 200 200"
          width={numericSize}
          height={numericSize}
          className="relative drop-shadow-sm transition-transform hover:scale-105 duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="circle-left-clip">
              <circle cx="75" cy="100" r="65" />
            </clipPath>
            <linearGradient id="cyan-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#48CAE4" />
              <stop offset="100%" stopColor="#2BB8B8" />
            </linearGradient>
            <linearGradient id="navy-depth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B3C68" />
              <stop offset="100%" stopColor="#082B4C" />
            </linearGradient>
          </defs>

          {variant === 'color' ? (
            <>
              {/* Left Circle: Deep Royal Navy Blue (#0F4C81) */}
              <circle cx="75" cy="100" r="65" fill="#0F4C81" />

              {/* Right Circle: Vibrant Aqua / Cyan (#38B6B6) */}
              <circle cx="125" cy="100" r="65" fill="#38B6B6" />

              {/* Overlapping intersection lens */}
              <g clipPath="url(#circle-left-clip)">
                <circle cx="125" cy="100" r="65" fill="#1A7C9B" opacity="0.95" />
              </g>

              {/* White bold 'E' right at the lens center */}
              <text
                x="100"
                y="126"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="74"
                fontWeight="900"
                fontFamily="'Manrope', 'Montserrat', -apple-system, sans-serif"
                letterSpacing="-1px"
              >
                E
              </text>
            </>
          ) : variant === 'mono-white' ? (
            <>
              <circle cx="75" cy="100" r="65" fill="#FFFFFF" fillOpacity="0.3" />
              <circle cx="125" cy="100" r="65" fill="#FFFFFF" fillOpacity="0.5" />
              <g clipPath="url(#circle-left-clip)">
                <circle cx="125" cy="100" r="65" fill="#FFFFFF" fillOpacity="0.8" />
              </g>
              <text
                x="100"
                y="126"
                textAnchor="middle"
                fill="#0F172A"
                fontSize="74"
                fontWeight="900"
                fontFamily="'Manrope', sans-serif"
              >
                E
              </text>
            </>
          ) : (
            <>
              <circle cx="75" cy="100" r="65" fill="#0F172A" />
              <circle cx="125" cy="100" r="65" fill="#334155" />
              <g clipPath="url(#circle-left-clip)">
                <circle cx="125" cy="100" r="65" fill="#1E293B" />
              </g>
              <text
                x="100"
                y="126"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="74"
                fontWeight="900"
                fontFamily="'Manrope', sans-serif"
              >
                E
              </text>
            </>
          )}
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-display font-bold tracking-wider text-base uppercase leading-none">
            ЭХО
          </span>
          <span className="text-[10px] text-slate-400 tracking-widest uppercase font-medium mt-0.5">
            Команда проекта
          </span>
        </div>
      )}
    </div>
  );
};
