import ConnectWalletButton from '@/containers/ConnectWalletButton'

import { cn } from '@/helpers/lib'

export interface Props {
  className?: string
}

export default function WalletConnect({ className }: Props) {
  const classRoot = cn('', className)

  return (
    <div className={classRoot}>
      <ConnectWalletButton />
    </div>
  )
}
