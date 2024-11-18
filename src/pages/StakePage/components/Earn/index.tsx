import BalanceInfo from '@/containers/BalanceInfo'
import BorderBlock from '@/components/BorderBlock'
import InfoItem from '@/components/InfoItem'

import { formatTimeToDate } from '@/helpers/date'
import { formatNumberWithCommas } from '@/helpers/format'
import { cn } from '@/helpers/lib'

export interface Props {
  className?: string
}

export default function Earn({ className }: Props) {
  const classRoot = cn('', className)

  const earnInfo = [
    {
      title: 'Total EDU Staked',
      value: `${formatNumberWithCommas(0)} EDU`
    },
    {
      title: 'End-of-Semester Claim in',
      value: formatTimeToDate(new Date(), new Date(Date.now() + 10000000))
    }
  ]

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
