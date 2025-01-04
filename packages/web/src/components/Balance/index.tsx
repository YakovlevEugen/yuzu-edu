import SvgIcon from '@/components/SvgIcon';

import type { IToken } from '@/constants/currencies';
import { formatNumberWithCommas } from '@/helpers/format';
import { cn } from '@/helpers/lib';

interface Props {
  classAmount?: string;
  className?: string;
  currency?: IToken;
  value: number | string;
  withCoin?: boolean;
}

export default function Balance({
  classAmount,
  className,
  currency = 'Yuzu',
  value,
  withCoin = true
}: Props) {
  const classRoot = cn(
    'flex flex-wrap items-center gap-x-3 font-bold text-[40px] md:text-[56px]',
    className
  );
  const classCurrency = cn({ 'text-orange': withCoin });
  const formattedValue = formatNumberWithCommas(String(value));

  return (
    <div className={classRoot}>
      <div className={classAmount}>{formattedValue ?? '--'}</div>
      <div className="flex items-center">
        {withCoin && <SvgIcon name="coin" />}
        <span className={classCurrency}>{currency}</span>
      </div>
    </div>
  );
}
