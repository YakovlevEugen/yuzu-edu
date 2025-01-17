import { type ComponentProps, type FC, forwardRef } from 'react';

import type { IToken } from '@/constants/currencies';
import { cn } from '@/helpers/lib';

interface Props extends ComponentProps<'input'> {
  currency?: IToken | FC;
}

const CurrencyInput = forwardRef<HTMLInputElement, Props>(
  ({ className, currency = 'EDU', ...otherProps }, ref) => {
    const CurrencyComponent =
      typeof currency === 'function'
        ? currency
        : () => (
            <div className="ml-1 text-3xl font-semibold text-green">
              {currency as string}
            </div>
          );

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

        <div className="ml-3">
          <CurrencyComponent />
        </div>
      </div>
    );
  }
);

export default CurrencyInput;
