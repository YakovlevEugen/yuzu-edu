import { useAccount } from 'wagmi'

import WalletConnect from '@/containers/WalletConnect'
import WalletMenu from '@/containers/WalletMenu'

import { cn } from '@/helpers/lib'

export interface Props {
  className?: string
}

export default function ProfileBlock({ className }: Props) {
  const { isConnected } = useAccount()

  const classRoot = cn('', className)

  return <div className={classRoot}>{isConnected ? <WalletMenu /> : <WalletConnect />}</div>
}
