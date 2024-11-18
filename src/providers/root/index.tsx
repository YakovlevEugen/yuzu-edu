import { ReactNode } from 'react'

import { RootContext } from './context'

interface Props {
  children?: ReactNode
}

export function RootContextProvider({ children }: Props) {
  return <RootContext.Provider value={{}}>{children}</RootContext.Provider>
}
