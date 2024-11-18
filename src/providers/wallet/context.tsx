import { createContext } from 'react'

import { WalletContext as IWalletContext } from '@/types/wallet'

export const WalletContext = createContext<IWalletContext>({})
