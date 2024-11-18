import { ComponentProps, forwardRef } from 'react'

import { cn } from '@/helpers/lib'
import { Currency } from '@/types/common'

interface Props extends ComponentProps<'input'> {
  currency?: Currency
}

const CurrencyInput = forwardRef<HTMLInputElement, Props>(({ className, currency = 'EDU', ...otherProps }, ref) => {
  return (
    <div className="flex items-center">
      <input
        className={cn(
          'h-16 w-full rounded-md bg-transparent py-2 text-4xl font-bold text-green placeholder:text-green/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        placeholder="0"
        {...otherProps}
      />
      {currency && <div className="ml-1 text-3xl font-semibold text-green">{currency}</div>}
    </div>
  )
})

export default CurrencyInput
