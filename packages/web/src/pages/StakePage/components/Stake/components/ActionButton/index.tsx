import { useFormContext } from 'react-hook-form';
import { parseEther } from 'viem';
import { useAccount, useSendTransaction } from 'wagmi';

import WalletConnect from '@/containers/WalletConnect';
import { Button } from 'ui/button';

import { cn } from '@/helpers/lib';
import { useToast } from '@/hooks/use-toast';
import type { FormSchema } from '@/pages/StakePage/components/Stake';

interface Props {
  className?: string;
}

export default function ActionButton({ className }: Props) {
  const { isConnected } = useAccount();
  const { watch } = useFormContext();
  const { sendTransactionAsync } = useSendTransaction();
  const { toast } = useToast();

  const classRoot = cn('', className);
  const activeTabId: FormSchema['activeTabId'] = watch('activeTabId');
  const amount: FormSchema['amount'] = watch('amount');

  async function stake() {
    try {
      await sendTransactionAsync({
        to: '0xDbD8e8bc1A1b6a563d4b9F75F72E577C42890fF7',
        value: parseEther(amount)
      });
      toast({ title: 'EDU Successfully Staked', variant: 'success' });
    } catch (error) {
      toast({ title: 'EDU Stake Failed', variant: 'destructive' });
      console.error(error);
    }
  }

  async function unwrap() {
    try {
      // TODO: add unwrap method
      // await sendTransactionAsync({
      //   to: '0xDbD8e8bc1A1b6a563d4b9F75F72E577C42890fF7',
      //   value: parseEther(amount)
      // })
      toast({ title: 'EDU Successfully Unwrapped', variant: 'success' });
    } catch (error) {
      toast({ title: 'EDU Unwrapped Failed', variant: 'destructive' });
      console.error(error);
    }
  }

  const actionFunction = activeTabId === 'stake' ? stake : unwrap;

  return (
    <div className={classRoot}>
      {isConnected ? (
        <Button
          className="w-full"
          disabled={!amount}
          size="lg"
          onClick={actionFunction}
        >
          Stake
        </Button>
      ) : (
        <WalletConnect triggerClass="w-full" triggerProps={{ size: 'lg' }} />
      )}
    </div>
  );
}
