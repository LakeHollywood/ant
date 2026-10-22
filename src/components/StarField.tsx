import { useMemo } from 'react';

const STAR_COUNT = 80;

interface Star {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

function createStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, (_, id) => ({
    id,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 8,
    duration: Math.random() * 6 + 6,
  }));
}

/** Decorative twinkling star background. Positions are memoized so stars
 *  don't jump on every re-render. */
export default function StarField() {
  const stars = useMemo(createStars, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white opacity-60"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `drift ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
