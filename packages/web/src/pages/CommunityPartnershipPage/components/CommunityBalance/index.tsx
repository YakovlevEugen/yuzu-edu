import BorderBlock from '@/components/BorderBlock';

import TransformCurrency from '@/components/TransformCurrency';
import { cn } from '@/helpers/lib';

interface Props {
  className?: string;
  balance?: number;
  title?: string;
}

export default function CommunityBalance({ className, balance, title }: Props) {
  const classRoot = cn('px-6 py-4', className);

  return (
    <BorderBlock className={classRoot}>
      <div className="mb-2 font-bold">{title}</div>
      <TransformCurrency
        className="text-2xl font-bold text-green"
        from={balance?.toString()}
      />
    </BorderBlock>
  );
}
