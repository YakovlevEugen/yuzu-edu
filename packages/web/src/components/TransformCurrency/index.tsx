import { cva, VariantProps } from 'class-variance-authority'

import { formatNumberWithCommas } from '@/helpers/format'
import { cn } from '@/helpers/lib'
import { TCurrency } from '@/types/common'

const variants = cva('flex items-baseline gap-1', {
  variants: {
    variant: {
      white: 'text-white',
      greenLight: 'text-green-light'
    },
    size: {
      default: '',
      l: 'text-[25px] xs:text-[40px] font-bold [&_.currency]:font-semibold [&_.currency]:text-[25px] xs:[&_.currency]:text-[32px] [&_.currency]:ml-1'
    }
  },
  defaultVariants: {
    size: 'default',
    variant: 'white'
  }
})

interface Props extends VariantProps<typeof variants> {
  className?: string
  currency?: TCurrency
  from?: string
  to: string
}

export default function TransformCurrency({ className, currency = 'Yuzu', from = '0', size, to, variant }: Props) {
  const classRoot = cn(variants({ className, size, variant }))

  return (
    <div className={classRoot}>
      {Boolean(from) && <span>{formatNumberWithCommas(from)}</span>}
      {Boolean(to) && (
        <>
          <span>→</span>
          {Boolean(to) && <span>{formatNumberWithCommas(to)}</span>}
        </>
      )}
      {currency && <span className="currency">{currency}</span>}
    </div>
  )
}
