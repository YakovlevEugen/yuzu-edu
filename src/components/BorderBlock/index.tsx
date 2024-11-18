import { cva, VariantProps } from 'class-variance-authority'
import { ReactNode } from 'react'

import { cn } from '@/helpers/lib'

const variants = cva('border-2 rounded-2xl shadow-border-box', {
  variants: {
    variant: {
      default: 'bg-beige',
      yellow: 'bg-yellow'
    },
    padding: {
      none: '',
      sm: 'py-6 px-10'
    }
  },
  defaultVariants: {
    variant: 'default',
    padding: 'sm'
  }
})

interface Props extends VariantProps<typeof variants> {
  children?: ReactNode
  className?: string
}

export default function BorderBlock({ children, className, variant, padding }: Props) {
  const classRoot = cn(variants({ className, padding, variant }))

  return <div className={classRoot}>{children}</div>
}
