import Balance from '@/components/Balance'

import { useWallet } from '@/providers/wallet/hook'
import { cn } from '@/helpers/lib'

export interface Props {
  className?: string
}

export default function BalanceInfo({ className }: Props) {
  const { wallet } = useWallet()

  const classRoot = cn('', className)

  return <Balance className={classRoot} value={wallet?.amount} />
}
