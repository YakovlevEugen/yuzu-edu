import { useMemo } from 'react'

import BalanceInfo from '@/containers/BalanceInfo'
import BorderBlock from '@/components/BorderBlock'
import InfoItem from '@/components/InfoItem'

import { formatTimeToDate } from '@/helpers/date'
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
        title: 'Total EDU Staked',
        value: `${formatBigWithComas(balance.data)} EDU`
      },
      {
        title: 'End-of-Semester Claim in',
        value: formatTimeToDate(new Date(), new Date(Date.now() + 10000000))
      }
    ],
    [balance.data]
  )

  return (
    <BorderBlock className={classRoot}>
      <div className="text-center">Yuzu Earned</div>
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
