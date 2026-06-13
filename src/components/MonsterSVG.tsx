import React from 'react';

interface GhostProps {
  className?: string;
  color: string;
  expression?: 'happy' | 'surprised' | 'winky' | 'spooky' | 'cheeky';
  size?: number;
}

export const Ghost: React.FC<GhostProps> = ({
  className = '',
  color,
  expression = 'happy',
  size = 60,
}) => {
  // Different eye styles per expression
  const renderEyes = () => {
    switch (expression) {
      case 'happy':
        return (
          <>
            <ellipse cx="-8" cy="-8" rx="5" ry="6" fill="white" stroke="#2D2D2D" strokeWidth="1.5" />
            <ellipse cx="8" cy="-8" rx="5" ry="6" fill="white" stroke="#2D2D2D" strokeWidth="1.5" />
            <circle cx="-6" cy="-7" r="2.5" fill="#2D2D2D" />
            <circle cx="10" cy="-7" r="2.5" fill="#2D2D2D" />
            <circle cx="-5" cy="-8" r="1" fill="white" />
            <circle cx="11" cy="-8" r="1" fill="white" />
          </>
        );
      case 'surprised':
        return (
          <>
            <circle cx="-8" cy="-7" r="6" fill="white" stroke="#2D2D2D" strokeWidth="1.5" />
            <circle cx="8" cy="-7" r="6" fill="white" stroke="#2D2D2D" strokeWidth="1.5" />
            <circle cx="-8" cy="-6" r="3.5" fill="#2D2D2D" />
            <circle cx="8" cy="-6" r="3.5" fill="#2D2D2D" />
            <circle cx="-7" cy="-8" r="1.2" fill="white" />
            <circle cx="9" cy="-8" r="1.2" fill="white" />
          </>
        );
      case 'winky':
        return (
          <>
            <ellipse cx="-8" cy="-8" rx="5" ry="6" fill="white" stroke="#2D2D2D" strokeWidth="1.5" />
            <circle cx="-6" cy="-7" r="2.5" fill="#2D2D2D" />
            <circle cx="-5" cy="-8" r="1" fill="white" />
            <path d="M 4 -8 Q 8 -4 12 -8" fill="none" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" />
          </>
        );
      case 'spooky':
        return (
          <>
            <ellipse cx="-8" cy="-6" rx="4" ry="5" fill="white" stroke="#2D2D2D" strokeWidth="1.5" />
            <ellipse cx="8" cy="-6" rx="4" ry="5" fill="white" stroke="#2D2D2D" strokeWidth="1.5" />
            <circle cx="-8" cy="-5" r="2" fill="#2D2D2D" />
            <circle cx="8" cy="-5" r="2" fill="#2D2D2D" />
            {/* Angry brows */}
            <path d="M -13 -13 L -5 -11" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />
            <path d="M 13 -13 L 5 -11" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'cheeky':
        return (
          <>
            <path d="M -12 -9 Q -8 -4 -4 -9" fill="white" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="-8" cy="-7" r="2" fill="#2D2D2D" />
            <path d="M 4 -9 Q 8 -4 12 -9" fill="white" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="-7" r="2" fill="#2D2D2D" />
          </>
        );
    }
  };

  const renderMouth = () => {
    switch (expression) {
      case 'happy':
        return <path d="M -5 2 Q 0 8 5 2" fill="none" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />;
      case 'surprised':
        return <ellipse cx="0" cy="4" rx="4" ry="5" fill="#2D2D2D" stroke="#2D2D2D" strokeWidth="1" />;
      case 'winky':
        return <path d="M -4 2 Q 0 6 4 2" fill="none" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />;
      case 'spooky':
        return <path d="M -6 1 L -3 4 L 0 1 L 3 4 L 6 1" fill="none" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />;
      case 'cheeky':
        return <path d="M -4 2 Q 2 8 6 1" fill="none" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />;
    }
  };

  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="-25 -30 50 65"
      className={className}
    >
      {/* Ghost body - rounded top, wavy bottom */}
      <path
        d="M -18 10
           C -18 -10 -14 -24 0 -26
           C 14 -24 18 -10 18 10
           L 18 18
           C 16 14 12 20 10 16
           C 8 12 4 20 2 16
           C 0 12 -4 20 -6 16
           C -8 12 -12 20 -14 16
           C -16 12 -18 18 -18 18
           Z"
        fill={color}
        stroke="#2D2D2D"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Inner glow */}
      <ellipse cx="0" cy="-8" rx="10" ry="12" fill="rgba(255,255,255,0.15)" />
      {/* Eyes */}
      {renderEyes()}
      {/* Cheek blush for happy/winky/cheeky */}
      {(expression === 'happy' || expression === 'winky' || expression === 'cheeky') && (
        <>
          <circle cx="-13" cy="0" r="3" fill="rgba(255,107,157,0.3)" />
          <circle cx="13" cy="0" r="3" fill="rgba(255,107,157,0.3)" />
        </>
      )}
      {/* Mouth */}
      {renderMouth()}
    </svg>
  );
};

export const ghosts = [
  { color: '#FF6B9D', expression: 'happy' as const },
  { color: '#4ECDC4', expression: 'surprised' as const },
  { color: '#FFE66D', expression: 'cheeky' as const },
  { color: '#A78BFA', expression: 'spooky' as const },
  { color: '#6BCB77', expression: 'winky' as const },
  { color: '#FF8C42', expression: 'happy' as const },
  { color: '#FF6B9D', expression: 'winky' as const },
  { color: '#4ECDC4', expression: 'cheeky' as const },
  { color: '#FFE66D', expression: 'surprised' as const },
  { color: '#A78BFA', expression: 'happy' as const },
  { color: '#6BCB77', expression: 'spooky' as const },
  { color: '#FF8C42', expression: 'cheeky' as const },
];

// Keep old names as aliases for backward compat in other components
export const Monster = Ghost;
export const monsters = ghosts;

export const DoodleStar: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 20,
}) => (
  <svg width={size} height={size} viewBox="0 0 20 20" className={className}>
    <path
      d="M10 0 L12 7 L20 7 L14 12 L16 20 L10 15 L4 20 L6 12 L0 7 L8 7 Z"
      fill="#FFE66D"
      stroke="#2D2D2D"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const DoodleHeart: React.FC<{ className?: string; size?: number; color?: string }> = ({
  className = '',
  size = 20,
  color = '#FF6B9D',
}) => (
  <svg width={size} height={size} viewBox="0 0 20 20" className={className}>
    <path
      d="M10 18 C4 12 0 8 0 5 C0 2 2 0 5 0 C7 0 9 1.5 10 3 C11 1.5 13 0 15 0 C18 0 20 2 20 5 C20 8 16 12 10 18Z"
      fill={color}
      stroke="#2D2D2D"
      strokeWidth="1.5"
    />
  </svg>
);

export const Squiggle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg width="100" height="20" viewBox="0 0 100 20" className={className}>
    <path
      d="M0 10 C10 0 20 20 30 10 C40 0 50 20 60 10 C70 0 80 20 90 10 C95 5 100 10 100 10"
      fill="none"
      stroke="#2D2D2D"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const DoodleGhost: React.FC<{ className?: string; size?: number; color?: string }> = ({
  className = '',
  size = 16,
  color = '#A78BFA',
}) => (
  <svg width={size} height={size * 1.2} viewBox="-25 -30 50 65" className={className}>
    <path
      d="M -18 10 C -18 -10 -14 -24 0 -26 C 14 -24 18 -10 18 10 L 18 18 C 16 14 12 20 10 16 C 8 12 4 20 2 16 C 0 12 -4 20 -6 16 C -8 12 -12 20 -14 16 C -16 12 -18 18 -18 18 Z"
      fill={color}
      stroke="#2D2D2D"
      strokeWidth="2"
    />
    <circle cx="-6" cy="-8" r="3" fill="white" stroke="#2D2D2D" strokeWidth="1" />
    <circle cx="6" cy="-8" r="3" fill="white" stroke="#2D2D2D" strokeWidth="1" />
    <circle cx="-5" cy="-7" r="1.5" fill="#2D2D2D" />
    <circle cx="7" cy="-7" r="1.5" fill="#2D2D2D" />
    <path d="M -3 2 Q 0 5 3 2" fill="none" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
