import React from 'react';

interface StickerProps {
  type: string;
  className?: string;
}

export const Sticker: React.FC<StickerProps> = ({ type, className = '' }) => {
  const commonStyle = {
    stroke: '#8a6f6f',
    strokeWidth: '2.5',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  const pastelFills = {
    pink: '#f3d6d6',
    lightPink: '#f6e7e7',
    blue: '#e6f1f1',
    orange: '#f8e9e0',
    purple: '#e9e3f7',
    yellow: '#fff5d7',
    green: '#e2f0cb'
  };

  const renderContent = () => {
    switch (type) {
      // --- Characters ---
      case 'char-1': // Girl with buns
        return (
          <g>
            {/* Hair Back */}
            <path d="M30 40 Q 10 40 10 70 Q 10 100 30 110 L 70 110 Q 90 100 90 70 Q 90 40 70 40" fill={pastelFills.pink} stroke="none" />
            {/* Face */}
            <circle cx="50" cy="60" r="25" fill={pastelFills.lightPink} {...commonStyle} />
            {/* Eyes */}
            <circle cx="42" cy="60" r="1.5" fill="#8a6f6f" />
            <circle cx="58" cy="60" r="1.5" fill="#8a6f6f" />
            {/* Blush */}
            <circle cx="38" cy="65" r="3" fill="#ffb6b6" opacity="0.4" />
            <circle cx="62" cy="65" r="3" fill="#ffb6b6" opacity="0.4" />
            {/* Mouth */}
            <path d="M48 68 Q 50 70 52 68" {...commonStyle} strokeWidth="1.5" />
            {/* Buns */}
            <circle cx="25" cy="45" r="10" fill={pastelFills.pink} {...commonStyle} />
            <circle cx="75" cy="45" r="10" fill={pastelFills.pink} {...commonStyle} />
            {/* Body */}
            <path d="M35 85 Q 30 110 50 110 Q 70 110 65 85" fill={pastelFills.blue} {...commonStyle} />
          </g>
        );
      case 'char-2': // Girl with short hair
        return (
          <g>
             {/* Hair */}
             <path d="M25 60 Q 25 30 50 30 Q 75 30 75 60 L 75 70 Q 75 80 65 80 L 35 80 Q 25 80 25 70 Z" fill={pastelFills.orange} {...commonStyle} />
             {/* Face */}
             <path d="M30 60 Q 30 90 50 90 Q 70 90 70 60" fill={pastelFills.lightPink} {...commonStyle} stroke="none" />
             <path d="M30 60 Q 30 90 50 90 Q 70 90 70 60" fill="none" {...commonStyle} />
             {/* Eyes (Curved) */}
             <path d="M40 65 Q 42 63 44 65" {...commonStyle} strokeWidth="1.5" />
             <path d="M56 65 Q 58 63 60 65" {...commonStyle} strokeWidth="1.5" />
             {/* Mouth */}
             <circle cx="50" cy="75" r="1" fill="#8a6f6f" />
             {/* Body */}
             <path d="M30 90 L 25 110 L 75 110 L 70 90" fill={pastelFills.purple} {...commonStyle} />
          </g>
        );
      
      // --- Lifestyle ---
      case 'life-1': // Book
        return (
          <g>
            <rect x="30" y="40" width="40" height="50" rx="2" fill={pastelFills.blue} {...commonStyle} />
            <path d="M35 40 L 35 90" {...commonStyle} strokeWidth="1" />
            <path d="M30 55 L 70 55" {...commonStyle} strokeWidth="1" />
            <rect x="40" y="50" width="20" height="20" rx="1" fill="white" stroke="none" opacity="0.5" />
          </g>
        );
      case 'life-2': // Tea Cup
        return (
          <g>
            <path d="M30 50 Q 30 80 50 80 Q 70 80 70 50 L 70 40 L 30 40 Z" fill={pastelFills.yellow} {...commonStyle} />
            <path d="M70 50 Q 80 50 80 60 Q 80 70 70 70" fill="none" {...commonStyle} />
            <path d="M40 30 Q 50 20 60 30" stroke="#ddd" strokeWidth="2" fill="none" />
            <path d="M45 20 Q 50 10 55 20" stroke="#ddd" strokeWidth="2" fill="none" />
          </g>
        );

      // --- Animals ---
      case 'animal-1': // Hamster
        return (
          <g>
            <ellipse cx="50" cy="60" rx="25" ry="30" fill={pastelFills.orange} {...commonStyle} />
            <circle cx="40" cy="55" r="2" fill="#8a6f6f" />
            <circle cx="60" cy="55" r="2" fill="#8a6f6f" />
            <path d="M48 62 Q 50 64 52 62" {...commonStyle} strokeWidth="1.5" />
            <circle cx="35" cy="60" r="4" fill="#ffb6b6" opacity="0.4" />
            <circle cx="65" cy="60" r="4" fill="#ffb6b6" opacity="0.4" />
            <path d="M35 80 Q 35 85 40 85" {...commonStyle} />
            <path d="M65 80 Q 65 85 60 85" {...commonStyle} />
          </g>
        );
      case 'animal-2': // Cat
        return (
          <g>
            <path d="M30 50 L 30 40 L 40 50 L 60 50 L 70 40 L 70 50 Q 75 75 50 75 Q 25 75 30 50" fill={pastelFills.purple} {...commonStyle} />
            <circle cx="40" cy="60" r="1.5" fill="#8a6f6f" />
            <circle cx="60" cy="60" r="1.5" fill="#8a6f6f" />
            <path d="M48 65 L 50 67 L 52 65" {...commonStyle} strokeWidth="1.5" />
          </g>
        );

      // --- Text ---
      case 'text-1': // Hello
        return (
          <text x="50" y="60" textAnchor="middle" fontFamily="monospace" fontSize="20" fill="#8a6f6f" style={{ fontWeight: 'bold' }}>hello</text>
        );
      case 'text-2': // Smile
        return (
          <text x="50" y="60" textAnchor="middle" fontFamily="cursive" fontSize="20" fill="#8a6f6f">smile :)</text>
        );

      // --- Decorative ---
      case 'deco-1': // Cloud
        return (
          <path d="M30 60 Q 30 40 50 40 Q 60 30 70 40 Q 90 40 90 60 Q 90 80 70 80 L 50 80 Q 30 80 30 60" fill={pastelFills.blue} {...commonStyle} />
        );
      case 'deco-2': // Flower
        return (
          <g>
             <circle cx="50" cy="50" r="10" fill={pastelFills.yellow} {...commonStyle} />
             <circle cx="50" cy="30" r="8" fill={pastelFills.pink} {...commonStyle} />
             <circle cx="50" cy="70" r="8" fill={pastelFills.pink} {...commonStyle} />
             <circle cx="30" cy="50" r="8" fill={pastelFills.pink} {...commonStyle} />
             <circle cx="70" cy="50" r="8" fill={pastelFills.pink} {...commonStyle} />
          </g>
        );
        
      default:
        return <circle cx="50" cy="50" r="20" fill="#eee" />;
    }
  };

  return (
    <svg viewBox="0 0 100 120" className={className} style={{ overflow: 'visible' }}>
      {renderContent()}
    </svg>
  );
};
