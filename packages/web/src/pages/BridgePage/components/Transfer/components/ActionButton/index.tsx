import { useFormContext } from 'react-hook-form';
// import { parseEther } from 'viem'
import { useAccount } from 'wagmi';

import WalletConnect from '@/containers/WalletConnect';
import { Button } from 'ui/button';

import { cn } from '@/helpers/lib';
import { useToast } from '@/hooks/use-toast';
import type { FormSchema } from '@/pages/BridgePage/components/Transfer';

interface Props {
  className?: string;
}

export default function ActionButton({ className }: Props) {
  const { isConnected } = useAccount();
  const { watch } = useFormContext();
  const { toast } = useToast();

  const classRoot = cn('', className);
  const activeTabId: FormSchema['activeTabId'] = watch('activeTabId');
  const amount: FormSchema['amount'] = watch('amount');

  async function deposit() {
    try {
      // TODO: add deposit method
      // await sendTransactionAsync({
      //   to: '0xDbD8e8bc1A1b6a563d4b9F75F72E577C42890fF7',
      //   value: parseEther(amount)
      // })
      toast({ title: 'Success Deposit', variant: 'success' });
    } catch (error) {
      toast({ title: 'Deposit Failed', variant: 'destructive' });
      console.error(error);
    }
  }

  async function withdraw() {
    try {
      // TODO: add withdraw method
      // await sendTransactionAsync({
      //   to: '0xDbD8e8bc1A1b6a563d4b9F75F72E577C42890fF7',
      //   value: parseEther(amount)
      // })
      toast({ title: 'Success Withdraw', variant: 'success' });
    } catch (error) {
      toast({ title: 'Withdraw Failed', variant: 'destructive' });
      console.error(error);
    }
  }

  const actionFunction = activeTabId === 'deposit' ? deposit : withdraw;

  return (
    <div className={classRoot}>
      {isConnected ? (
        <Button
          className="w-full"
          disabled={!amount}
          size="lg"
          onClick={actionFunction}
        >
          Bridge
        </Button>
      ) : (
        <WalletConnect triggerClass="w-full" triggerProps={{ size: 'lg' }} />
      )}
    </div>
  );
}
