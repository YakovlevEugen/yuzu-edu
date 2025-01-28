import { useFormContext } from 'react-hook-form';
import { useAccount, useSendTransaction } from 'wagmi';

import WalletConnect from '@/containers/WalletConnect';
import { Button } from 'ui/button';

import { cn } from '@/helpers/lib';
import {
  useBridgeApproveTx,
  useBridgeDepositTx,
  useBridgeWithdrawTx,
  useTokenBalance
} from '@/hooks/api';
import { useAnalytics } from '@/hooks/posthog';
import { useChainId, useParentChainId } from '@/hooks/use-chain-id';
import { useEnsureChain } from '@/hooks/use-ensure-chain';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { FormSchema } from '../..';

interface Props {
  className?: string;
}

export default function ActionButton({ className }: Props) {
  const { track } = useAnalytics();
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const form = useFormContext<FormSchema>();
  const { sendTransactionAsync } = useSendTransaction();

  const approveTx = useBridgeApproveTx();
  const depositTx = useBridgeDepositTx();
  const withdrawTx = useBridgeWithdrawTx();

  const { intent, amount, token: symbol } = form.watch();

  const chainId = useChainId();
  const parentChainId = useParentChainId();

  const parentBalance = useTokenBalance(parentChainId, symbol);
  const childBalance = useTokenBalance(chainId, symbol);
  const ensureChain = useEnsureChain();

  const [hint, setHint] = useState<string>();

  async function deposit() {
    try {
      track('deposit_started', { chainId });

      await ensureChain(parentChainId);

      setHint('Loading');

      await approveTx.mutateAsync({ symbol, amount }).then((tx) => {
        setHint('Singing 1/2');
        return sendTransactionAsync(tx);
      });

      setHint('Loading');

      await depositTx.mutateAsync({ symbol, amount }).then((tx) => {
        setHint('Singing 2/2');
        return sendTransactionAsync(tx);
      });

      form.setValue('amount', '0');
      setHint(undefined);
      parentBalance.refetch();
      childBalance.refetch();

      toast({ title: 'Deposit Successful', variant: 'success' });
      track('deposit_success', { address, amount, chainId });
    } catch (error) {
      const { message } = error as { message: string };
      setHint(undefined);

      if (message.includes('User rejected the request.')) {
        toast({ title: 'User cancelled', variant: 'default' });
      } else {
        toast({ title: 'Deposit Failed', variant: 'destructive' });
        track('deposit_failure', {
          message: (error as { message: string }).message,
          isError: true
        });
        console.error(error);
      }
    }
  }

  async function withdraw() {
    try {
      track('withdraw_started', { chainId });

      await ensureChain(chainId);

      setHint('Loading');

      await withdrawTx.mutateAsync({ symbol, amount }).then((tx) => {
        setHint('Singing 1/1');
        return sendTransactionAsync(tx);
      });

      form.setValue('amount', '0');
      setHint(undefined);
      parentBalance.refetch();
      childBalance.refetch();

      toast({ title: 'Withdraw Successful', variant: 'success' });
      track('withdraw_success', { address, amount, chainId });
    } catch (error) {
      const { message } = error as { message: string };
      setHint(undefined);

      if (message.includes('User rejected the request.')) {
        toast({ title: 'User cancelled', variant: 'default' });
      } else {
        toast({ title: 'Withdraw Failed', variant: 'destructive' });
        track('withdraw_failure', {
          message: (error as { message: string }).message,
          isError: true
        });
        console.error(error);
      }
    }
  }

  return (
    <div className={cn(className)}>
      {isConnected ? (
        <Button
          className="w-full"
          disabled={!amount || Boolean(hint)}
          size="lg"
          onClick={intent === 'deposit' ? deposit : withdraw}
        >
          {hint || 'Bridge'}
        </Button>
      ) : (
        <WalletConnect triggerClass="w-full" triggerProps={{ size: 'lg' }} />
      )}
    </div>
  );
}
