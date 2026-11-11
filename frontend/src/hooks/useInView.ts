import { useEffect, useRef, useState } from 'react';

interface UseInViewResult<T extends Element> {
  ref: React.RefObject<T | null>;
  inView: boolean;
}

/**
 * Small presentational helper: marks an element as visible the first time it
 * enters the viewport. Falls back to visible when IntersectionObserver is
 * unavailable (older browsers, tests, SSR).
 */
export function useInView<T extends Element>(
  options?: IntersectionObserverInit,
): UseInViewResult<T> {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -8% 0px',
        ...options,
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}
