import { useContext } from 'react'

import { RootContext } from './index'

export function useRoot() {
  const context = useContext(RootContext)

  if (!context) {
    throw new Error('useRoot must be used within a RootContextProvider')
  }

  return context
}
