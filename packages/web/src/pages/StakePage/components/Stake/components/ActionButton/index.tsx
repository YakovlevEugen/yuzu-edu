import WalletConnect from '@/containers/WalletConnect';
import { isNumberish } from '@/helpers/common';
import { cn } from '@/helpers/lib';
import {
  useCreateStakeTx,
  useCreateUnstakeTx,
  useStakingPoints,
  useTokenBalance
} from '@/hooks/api';
import { useChainId } from '@/hooks/use-chain-id';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from 'ui/button';
import { useAccount, useSendTransaction } from 'wagmi';
import type { FormSchema } from '../..';

interface Props {
  className?: string;
}

export default function ActionButton({ className }: Props) {
  const { isConnected } = useAccount();
  const { watch } = useFormContext<FormSchema>();
  const { sendTransactionAsync } = useSendTransaction();
  const { toast } = useToast();
  const stakeTx = useCreateStakeTx();
  const unstakeTx = useCreateUnstakeTx();

  const chainId = useChainId();
  const eduBalance = useTokenBalance(chainId, 'edu');
  const weduBalance = useTokenBalance(chainId, 'wedu');
  const stakingPoints = useStakingPoints();

  const classRoot = cn('', className);
  const activeTabId = watch('activeTabId');
  const amount = watch('amount');

  const [loading, setLoading] = useState(false);

  async function stake() {
    try {
      setLoading(true);

      const txId = await stakeTx
        .mutateAsync({ amount })
        .then(sendTransactionAsync);

      eduBalance.refetch();
      weduBalance.refetch();
      stakingPoints.refetch();

      console.log('View Tx in explorer', txId);

      toast({ title: 'EDU Successfully Staked', variant: 'success' });
    } catch (error) {
      toast({ title: 'EDU Stake Failed', variant: 'destructive' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function unstake() {
    try {
      setLoading(true);

      const txId = await unstakeTx
        .mutateAsync({ amount })
        .then(sendTransactionAsync);
      console.log('View Tx in explorer', txId);

      toast({
        title: 'EDU Successfully Unstaked',
        variant: 'success'
      });
    } catch (error) {
      toast({ title: 'EDU Unstaking Failed', variant: 'destructive' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const actionFunction = activeTabId === 'stake' ? stake : unstake;

  return (
    <div className={classRoot}>
      {isConnected ? (
        <Button
          className="w-full"
          disabled={loading || !isNumberish(amount)}
          size="lg"
          onClick={actionFunction}
        >
          {loading
            ? activeTabId === 'stake'
              ? 'Staking'
              : 'Unstaking'
            : activeTabId === 'stake'
              ? 'Stake'
              : 'Unstake'}
        </Button>
      ) : (
        <WalletConnect triggerClass="w-full" triggerProps={{ size: 'lg' }} />
      )}
    </div>
  );
}
