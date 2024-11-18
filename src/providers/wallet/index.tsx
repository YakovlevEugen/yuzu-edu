import { ReactNode, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Wallet } from '@/types/wallet'
import { WalletContext } from './context'

interface Props {
  children?: ReactNode
}

export function WalletContextProvider({ children }: Props) {
  const [searchParams] = useSearchParams()

  const [wallet, setWallet] = useState<Wallet>(null)
  const value = { wallet, setWallet }

  useEffect(() => {
    if (searchParams.get('wallet') === 'on') {
      setWallet({
        id: '0x11RA0x11BAe184e183e185',
        amount: 10000
      })
    }
  }, [searchParams])

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
