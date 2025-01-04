import Balance from '@/components/Balance';
import { cn } from '@/helpers/lib';
import { useStakingPoints } from '@/hooks/api';

export default function BalanceInfo({ className }: { className?: string }) {
  const points = useStakingPoints();

  return (
    <Balance className={cn(className)} value={points.data} currency="Yuzu" />
  );
}
