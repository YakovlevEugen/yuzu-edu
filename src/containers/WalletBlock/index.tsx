import WalletConnect from '@/containers/WalletConnect'
import WalletMenu from '@/containers/WalletMenu'

import { cn } from '@/helpers/lib'
import { useWallet } from '@/providers/wallet/hook'

export interface Props {
  className?: string
}

export default function ProfileBlock({ className }: Props) {
  const { wallet } = useWallet()

  const classRoot = cn('', className)

  return <div className={classRoot}>{wallet?.id ? <WalletMenu /> : <WalletConnect />}</div>
}
