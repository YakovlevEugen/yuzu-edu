import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// import { useApiCall } from '@/hooks/api-call'

export interface Props {
  children: ReactNode
}

const queryClient = new QueryClient()

export function QueryProvider({ children }: Props) {
  // const apiCall = useApiCall()
  // const settings = { fetcher: apiCall, revalidateOnFocus: false, revalidateOnReconnect: false }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
