import { useCallback, useMemo } from 'react'
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom'
import qs from 'qs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useQueryParams<RETURN_TYPE = any>(
  defaultValues?: URLSearchParamsInit
): [
  RETURN_TYPE,
  (
    value: Partial<RETURN_TYPE>,
    navigateOptions?:
      | {
          replace?: boolean | undefined
          state?: any // eslint-disable-line @typescript-eslint/no-explicit-any
        }
      | undefined
  ) => void
] {
  const [value, setValue] = useSearchParams(defaultValues)

  const parsedQueryParams: RETURN_TYPE = useMemo(
    () => Object.fromEntries([...value]) as unknown as RETURN_TYPE,
    [value]
  )

  const setQueryParams = useCallback(
    (values: Partial<RETURN_TYPE>) => {
      setValue(qs.stringify({ ...parsedQueryParams, ...values }))
    },
    [parsedQueryParams, setValue]
  )

  return [parsedQueryParams, setQueryParams]
}
