import Big from 'big.js';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAccount, useSendTransaction } from 'wagmi';

import WalletConnect from '@/containers/WalletConnect';
import { Button } from 'ui/button';

import { isNumberish } from '@/helpers/common';
import { cn } from '@/helpers/lib';
import {
  useCreateStakeTx,
  useCreateUnstakeTx,
  useStakingPoints,
  useTokenBalance
} from '@/hooks/api';
import { useAnalytics } from '@/hooks/posthog';
import { useChainId } from '@/hooks/use-chain-id';
import { useEnsureChain } from '@/hooks/use-ensure-chain';
import { useToast } from '@/hooks/use-toast';
import type { FormSchema } from '../..';

interface Props {
  className?: string;
}

const STAKE_FEE = 0.0001;

export default function ActionButton({ className }: Props) {
  const { address, isConnected } = useAccount();
  const { track } = useAnalytics();
  const { watch, setValue } = useFormContext<FormSchema>();

  const { sendTransactionAsync } = useSendTransaction();
  const { toast } = useToast();

  const chainId = useChainId();
  const stakeTx = useCreateStakeTx();
  const unstakeTx = useCreateUnstakeTx();
  const ensureChain = useEnsureChain();

  const eduBalance = useTokenBalance(chainId, 'edu');
  const weduBalance = useTokenBalance(chainId, 'wedu');
  const stakingPoints = useStakingPoints();

  const classRoot = cn('', className);
  const activeTabId = watch('activeTabId');
  const amount = watch('amount');

  const [loading, setLoading] = useState(false);

  async function stake() {
    try {
      track('stake_edu_started', { address });
      setLoading(true);

      if (new Big(eduBalance.data).lt(amount)) {
        toast({
          title: 'Not enough EDU to stake',
          variant: 'destructive'
        });
        return;
      }

      if (new Big(eduBalance.data).minus(STAKE_FEE).lt(amount)) {
        toast({
          title: 'Not enough EDU left to pay for gas (0.0001EDU)',
          variant: 'destructive'
        });
        return;
      }

      const [tx] = await Promise.all([
        stakeTx.mutateAsync({ amount }),
        ensureChain(chainId)
      ]);

      const txId = await sendTransactionAsync(tx);

      setValue('amount', '0');

      eduBalance.refetch();
      weduBalance.refetch();
      stakingPoints.refetch();

      console.log('View Tx in explorer', txId);
      toast({ title: 'EDU Successfully Staked', variant: 'success' });
      track('stake_edu_success', { address, amount });
    } catch (error: unknown) {
      const { message } = error as { message: string };

      track('stake_edu_failure', { message, isError: true });
      if (message.includes('User rejected the request.')) {
        toast({ title: 'User cancelled', variant: 'default' });
      } else {
        toast({ title: 'EDU Stake Failed', variant: 'destructive' });
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }

  async function unstake() {
    try {
      track('unstake_edu_started', { address });
      setLoading(true);

      const [tx] = await Promise.all([
        unstakeTx.mutateAsync({ amount }),
        ensureChain(chainId)
      ]);

      const txId = await sendTransactionAsync(tx);

      setValue('amount', '0');

      eduBalance.refetch();
      weduBalance.refetch();
      stakingPoints.refetch();

      console.log('View Tx in explorer', txId);

      toast({
        title: 'EDU Successfully Unstaked',
        variant: 'success'
      });
      track('unstake_edu_success', { address, amount });
    } catch (error: unknown) {
      const { message } = error as { message: string };

      track('unstake_edu_failure', { message, isError: true });
      if (message.includes('User rejected the request.')) {
        toast({ title: 'User cancelled', variant: 'default' });
      } else {
        toast({ title: 'EDU Unstaking Failed', variant: 'destructive' });
        console.error(error);
      }
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
