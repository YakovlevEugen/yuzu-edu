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

  async function deposit() {
    try {
      track('deposit_started', { chainId });

      await ensureChain(parentChainId);

      await approveTx
        .mutateAsync({ symbol, amount })
        .then(sendTransactionAsync);

      await depositTx
        .mutateAsync({ symbol, amount })
        .then(sendTransactionAsync);

      parentBalance.refetch();
      childBalance.refetch();

      toast({ title: 'Success Deposit', variant: 'success' });
      track('deposit_success', { address, amount, chainId });
    } catch (error) {
      toast({ title: 'Deposit Failed', variant: 'destructive' });
      track('deposit_failure', { message: error.message, isError: true });
      console.error(error);
    }
  }

  async function withdraw() {
    try {
      track('withdraw_started', { chainId });
      await ensureChain(chainId);

      await withdrawTx
        .mutateAsync({ symbol, amount })
        .then(sendTransactionAsync);

      parentBalance.refetch();
      childBalance.refetch();

      toast({ title: 'Success Withdraw', variant: 'success' });
      track('withdraw_success', { address, amount, chainId });
    } catch (error) {
      toast({ title: 'Withdraw Failed', variant: 'destructive' });
      track('withdraw_failure', { message: error.message, isError: true });
      console.error(error);
    }
  }

  return (
    <div className={cn(className)}>
      {isConnected ? (
        <Button
          className="w-full"
          disabled={!amount}
          size="lg"
          onClick={intent === 'deposit' ? deposit : withdraw}
        >
          Bridge
        </Button>
      ) : (
        <WalletConnect triggerClass="w-full" triggerProps={{ size: 'lg' }} />
      )}
    </div>
  );
}
