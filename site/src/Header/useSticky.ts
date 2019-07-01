import { useEffect, useRef, useState } from 'react';

export const useSticky = (threshold: number = 0) => {
  const frame = useRef(0);
  const isClient =
    typeof window !== 'undefined' && typeof window.scrollY !== 'undefined';

  const isSticky = () => {
    const scrollPosition = isClient ? window.scrollY : 0;
    return scrollPosition >= threshold;
  };
  const [state, setState] = useState(isSticky());

  useEffect(() => {
    const handler = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        setState(isSticky());
      });
    };

    window.addEventListener('scroll', handler, {
      capture: false,
      passive: true,
    });

    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener('scroll', handler);
    };
  }, []);

  return state;
};
