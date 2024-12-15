import { ComponentProps, FC, forwardRef } from 'react'

import { cn } from '@/helpers/lib'
import { TCurrency } from '@/types/common'

interface Props extends ComponentProps<'input'> {
  currency?: TCurrency | FC
}

const CurrencyInput = forwardRef<HTMLInputElement, Props>(({ className, currency = 'EDU', ...otherProps }, ref) => {
  const isCurrencyFunction = typeof currency === 'function'
  const CurrencyComponent = isCurrencyFunction ? currency : null

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
      {isCurrencyFunction && CurrencyComponent ? (
        <CurrencyComponent />
      ) : (
        <div className="ml-1 text-3xl font-semibold text-green">{currency}</div>
      )}
    </div>
  )
})

export default CurrencyInput
