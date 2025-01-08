import BorderBlock from '@/components/BorderBlock';
import InfoItem from '@/components/InfoItem';
import BalanceInfo from '@/containers/BalanceInfo';
import ReferralBlock from '@/containers/ReferralBlock';
import { formatBigWithComas } from '@/helpers/format';
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
        title: 'Total EDU Bridged',
        value: `${formatBigWithComas(weduBalance.data)} EDU`
      }
    ],
    [weduBalance]
  );

  return (
    <BorderBlock className={cn(className)}>
      <div className="mt-3 text-center">Yuzu Earned</div>
      <BalanceInfo className="mb-4 justify-center" />
      {!!earnInfo.length && (
        <div className="group">
          {earnInfo.map((info) => (
            <InfoItem key={info.title} className="mt-4 first:mt-0" {...info} />
          ))}
        </div>
      )}

      <ReferralBlock className="mt-4 md:mt-6" />
    </BorderBlock>
  );
}
