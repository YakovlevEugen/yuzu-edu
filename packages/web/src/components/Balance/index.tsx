import SvgIcon from '@/components/SvgIcon'

import { formatNumberWithCommas } from '@/helpers/format'
import { cn } from '@/helpers/lib'
import { Currency } from '@/types/common'

export interface Props {
  className?: string
  currency?: Currency
  value: string
  withCoin?: boolean
}

export default function Balance({ withCoin = true, className, currency = 'Yuzu', value }: Props) {
  const classRoot = cn('flex flex-wrap items-center gap-x-3 font-bold text-[40px] md:text-[56px]', className)
  const classCurrency = cn({ 'text-orange': withCoin })
  const formattedValue = formatNumberWithCommas(value)

  return (
    <div className={classRoot}>
      <div>{formattedValue ?? '--'}</div>
      <div className="flex items-center">
        {withCoin && <SvgIcon name="coin" />}
        <span className={classCurrency}>{currency}</span>
      </div>
    </div>
  )
}
