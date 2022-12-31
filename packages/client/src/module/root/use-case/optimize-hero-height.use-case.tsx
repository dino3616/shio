import { useEffect, useRef } from 'react';

export const useOptimizeHeroHeight = <T extends HTMLElement>(upperElementHeight: number | undefined) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (upperElementHeight !== undefined && ref.current) {
      ref.current.style.height = `calc(100vh - ${upperElementHeight}px)`;
    }
  }, [upperElementHeight]);

  return ref;
};
