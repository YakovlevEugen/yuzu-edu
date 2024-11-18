import { useAccount, useBalance } from 'wagmi'

import Balance from '@/components/Balance'

import { cn } from '@/helpers/lib'

export interface Props {
  className?: string
}

export default function BalanceInfo({ className }: Props) {
  const { address } = useAccount()
  const { data } = useBalance({ address })

  const classRoot = cn('', className)

  return <Balance className={classRoot} value={data?.value} />
}
