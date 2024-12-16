import SvgIcon from '@/components/SvgIcon'

import { CURRENCY_TITLE } from '@/constants/currencies'
import { cn } from '@/helpers/lib'
import { TTokens } from '@/types/common'

interface Props {
  className?: string
  from: TTokens
  to: TTokens
}

export default function TransformFromTo({ className, from, to }: Props) {
  const classRoot = cn(
    'items-center flex flex-col gap-y-7 p-6 bg-green-toxic rounded-2xl md:justify-between md:flex-row md:gap-y-0',
    className
  )

  return (
    <div className={classRoot}>
      <div className="flex-[1]">
        <div className="text-center text-sm md:text-left">From</div>
        <div className="mt-2 flex items-center gap-x-1">
          <SvgIcon className="h-6 w-6" name={from} />
          <span>{CURRENCY_TITLE?.[from]}</span>
        </div>
      </div>

      <SvgIcon className="w-[50px] rotate-90 md:-translate-x-2 md:rotate-0" name="arrow-curved" />

      <div className="flex-[1]">
        <div className="text-center text-sm md:text-left">To</div>
        <div className="mt-2 flex items-center gap-x-1">
          <SvgIcon className="h-6 w-6" name={to} />
          <span>{CURRENCY_TITLE?.[to]}</span>
        </div>
      </div>
    </div>
  )
}
