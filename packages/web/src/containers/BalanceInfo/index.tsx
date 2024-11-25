import Balance from '@/components/Balance'

import { cn } from '@/helpers/lib'
import { usePointBalance } from '@/hooks/api'

interface Props {
  className?: string
}

export default function BalanceInfo({ className }: Props) {
  const points = usePointBalance()

  return <Balance className={cn('', className)} value={points.data} currency="Yuzu" />
}
