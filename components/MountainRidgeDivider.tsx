type MountainRidgeDividerProps = {
  flip?: boolean;
  className?: string;
};

export default function MountainRidgeDivider({ flip = false, className = '' }: MountainRidgeDividerProps) {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="w-full h-12 md:h-16 block"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ridgeGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B8922F" />
            <stop offset="50%" stopColor="#D4A843" />
            <stop offset="100%" stopColor="#E8C76A" />
          </linearGradient>
        </defs>
        <path
          d="M0,80 L0,45 L120,20 L240,50 L360,15 L480,42 L600,10 L720,38 L840,18 L960,48 L1080,22 L1200,45 L1320,12 L1440,35 L1440,80 Z"
          fill="url(#ridgeGold)"
        />
        <path
          d="M0,80 L0,55 L120,35 L240,58 L360,30 L480,55 L600,28 L720,52 L840,32 L960,60 L1080,38 L1200,58 L1320,30 L1440,50 L1440,80 Z"
          fill="#0A1628"
          opacity="0.15"
        />
      </svg>
    </div>
  );
}
