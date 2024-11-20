import { useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CallFn<T> = (...args: any[]) => Promise<T>

export function useLoading<T>() {
  const [isLoading, setIsLoading] = useState(false)

  const callFn =
    (fn: CallFn<T>) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (...args: any[]) => {
      setIsLoading(true)
      try {
        const result = await fn(...args)
        setIsLoading(false)
        return result
      } catch (error) {
        setIsLoading(false)
        throw error
      }
    }

  return { callFn, isLoading }
}
