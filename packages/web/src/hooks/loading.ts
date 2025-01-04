import { useState } from 'react';

export type CallFn<T extends []> = (...args: T) => Promise<T>;

export function useLoading<T extends []>() {
  const [isLoading, setIsLoading] = useState(false);

  const callFn =
    (fn: CallFn<T>) =>
    async (...args: T) => {
      setIsLoading(true);
      try {
        const result = await fn(...args);
        setIsLoading(false);
        return result;
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    };

  return { callFn, isLoading };
}
