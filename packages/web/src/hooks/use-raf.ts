import { useCallback, useEffect, useRef } from 'react';

export const useRaf = (callback: () => unknown) => {
  const requestRef = useRef<number>(0);

  const animate = useCallback(() => {
    callback();
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);
};
