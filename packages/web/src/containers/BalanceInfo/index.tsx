import { useAccount } from 'wagmi'

import Balance from '@/components/Balance'

import { cn } from '@/helpers/lib'
import { useBalance } from '@/hooks/api'

export interface Props {
  className?: string
}

export default function BalanceInfo({ className }: Props) {
  const { address } = useAccount()
  const balance = useBalance(address)

  const classRoot = cn('', className)

  return <Balance className={classRoot} value={balance.data} />
}
