import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '@/helpers/lib'
import { IInfoItem } from '@/types/components'

const variants = cva('flex items-baseline gap-1', {
  variants: {
    variant: {
      white: 'text-white',
      green: 'text-green'
    }
  },
  defaultVariants: {
    variant: 'green'
  }
})

export interface Props extends IInfoItem, VariantProps<typeof variants> {
  className?: string
}

export default function InfoItem({ className, title = '', value = '', variant }: Props) {
  const classRoot = cn('flex justify-between gap-x-2.5', className)
  const classValue = cn('flex-none font-semibold', variants({ variant }))

  return (
    <div className={classRoot}>
      <div>{title}</div>
      <div className={classValue}>{value}</div>
    </div>
  )
}
