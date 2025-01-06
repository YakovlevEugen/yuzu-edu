import Balance from '@/components/Balance';
import { cn } from '@/helpers/lib';
import { useStakingPoints, useTokenBalance } from '@/hooks/api';
import { useChainId } from '@/hooks/use-chain-id';
import { useRaf } from '@/hooks/use-raf';
import Big from 'big.js';
import { useCallback, useEffect, useState } from 'react';

export default function BalanceInfo({ className }: { className?: string }) {
  const chainId = useChainId();
  const points = useStakingPoints();
  const weduBalance = useTokenBalance(chainId, 'wedu');
  const [value, setValue] = useState(points.data);

  const [since, setSince] = useState<number>(Date.now());

  useEffect(() => {
    setSince(points.dataUpdatedAt);
  }, [points.dataUpdatedAt]);

  useRaf(
    useCallback(() => {
      setValue(
        new Big(Date.now())
          .minus(since)
          .div(86400000)
          .mul(weduBalance.data)
          .add(points.data)
          .toNumber()
      );
    }, [points, weduBalance, since])
  );

  return <Balance className={cn(className)} value={value} currency="Yuzu" />;
}
