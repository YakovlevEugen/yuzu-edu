import { useMemo } from 'react'

import BalanceInfo from '@/containers/BalanceInfo'
import BorderBlock from '@/components/BorderBlock'
import InfoItem from '@/components/InfoItem'

import { formatBigWithComas } from '@/helpers/format'
import { cn } from '@/helpers/lib'
import { useStakeBalance } from '@/hooks/api'

interface Props {
  className?: string
}

export default function Earn({ className }: Props) {
  const balance = useStakeBalance()

  const classRoot = cn('', className)
  const earnInfo = useMemo(
    () => [
      {
        title: 'Total EDU Bridged',
        value: `${formatBigWithComas(balance.data)} EDU`
      }
    ],
    [balance.data]
  )

  return (
    <BorderBlock className={classRoot}>
      <div className="mt-3 text-center">Yuzu Earned</div>
      <BalanceInfo className="mb-4 justify-center" />
      {!!earnInfo.length && (
        <div className="group">
          {earnInfo.map((info) => (
            <InfoItem key={info.title} className="mt-4 first:mt-0" {...info} />
          ))}
        </div>
      )}
    </BorderBlock>
  )
}
