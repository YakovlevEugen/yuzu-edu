import BorderBlock from '@/components/BorderBlock';
import InfoItem from '@/components/InfoItem';
import BalanceInfo from '@/containers/BalanceInfo';
import { formatTimeToDate } from '@/helpers/date';
import { formatNumberWithCommas } from '@/helpers/format';
import { cn } from '@/helpers/lib';
import { useTokenBalance } from '@/hooks/api';
import { useChainId } from '@/hooks/use-chain-id';
import { useMemo } from 'react';

export default function Earn({ className }: { className?: string }) {
  const chainId = useChainId();
  const weduBalance = useTokenBalance(chainId, 'wedu');

  const earnInfo = useMemo(
    () => [
      {
        title: 'Total EDU Staked',
        value: `${formatNumberWithCommas(weduBalance.data)} EDU`
      },
      {
        title: 'End-of-Semester Claim in',
        value: formatTimeToDate(new Date(), new Date('2025-03-17T00:00:00Z'))
      }
    ],
    [weduBalance]
  );

  return (
    <BorderBlock className={cn(className)}>
      <div className="mt-3 text-center">Yuzu Earned</div>
      <BalanceInfo className="mb-4 justify-center" />
      <div className="group">
        {earnInfo.map((info) => (
          <InfoItem key={info.title} className="mt-4 first:mt-0" {...info} />
        ))}
      </div>
    </BorderBlock>
  );
}
