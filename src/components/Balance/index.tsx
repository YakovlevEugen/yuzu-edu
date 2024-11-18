import SvgIcon from '@/components/SvgIcon'

import { formatNumberWithCommas } from '@/helpers/format'
import { cn } from '@/helpers/lib'

export interface Props {
  className?: string
  value: number | string
}

export default function Balance({ className, value }: Props) {
  const classRoot = cn('flex flex-wrap items-center gap-x-3 font-bold text-[40px] md:text-[56px]', className)
  const formattedValue = formatNumberWithCommas(value)

  return (
    <div className={classRoot}>
      <div>{formattedValue ?? '--'}</div>
      <div className="flex items-center">
        <SvgIcon name="coin" />
        <span className="text-orange">Yuzu</span>
      </div>
    </div>
  )
}
