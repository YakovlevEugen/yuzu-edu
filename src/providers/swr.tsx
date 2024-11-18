import { ReactNode } from 'react'
import { SWRConfig as SWRConfigNative } from 'swr'

import { useApiCall } from '@/hooks/api-call'

export interface Props {
  children: ReactNode
}

export function SWRConfig({ children }: Props) {
  const apiCall = useApiCall()
  const settings = { fetcher: apiCall, revalidateOnFocus: false, revalidateOnReconnect: false }

  return <SWRConfigNative value={settings}>{children}</SWRConfigNative>
}
