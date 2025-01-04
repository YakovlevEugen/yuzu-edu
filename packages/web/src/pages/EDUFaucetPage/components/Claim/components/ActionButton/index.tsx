import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
// import { parseEther } from 'viem'
import { useAccount } from 'wagmi';
import { z } from 'zod';

import TurnstileWidget from '@/components/TurnstileWidget';
import WalletConnect from '@/containers/WalletConnect';
import { Button } from 'ui/button';

import { cn } from '@/helpers/lib';
// import { useToast } from '@/hooks/use-toast'

export const FormSchema = z.object({
  token: z.string({ required_error: 'CAPTCHA verification is required' })
});
export type FormSchema = z.infer<typeof FormSchema>;

interface Props {
  className?: string;
}

export default function ActionButton({ className }: Props) {
  const { isConnected } = useAccount();
  // const { sendTransactionAsync } = useSendTransaction()
  // const { toast } = useToast()
  const {
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormSchema>({
    defaultValues: {
      token: ''
    },
    resolver: zodResolver(FormSchema)
  });

  const [, setIsCaptchaVerified] = useState(false);

  const classRoot = cn('', className);
  const isClaimed = false;
  const isConfirming = false;
  const value = '2132'; // TODO: integrate with wallet

  // async function claim() {
  //   try {
  //     await sendTransactionAsync({
  //       to: '0xDbD8e8bc1A1b6a563d4b9F75F72E577C42890fF7',
  //       value: parseEther(value)
  //     })
  //     toast({ title: 'EDU Successfully Claimed', variant: 'success' })
  //   } catch (error) {
  //     toast({ title: 'EDU Claim Failed', variant: 'destructive' })
  //     console.error(error)
  //   }
  // }

  function handleTurnstileVerify(token: string) {
    console.log('token', token);
    setValue('token', token);
    setIsCaptchaVerified(true);
  }

  function handleTurnstileExpire() {
    setValue('token', '');
    setIsCaptchaVerified(false);
  }

  function handleTurnstileError(error: string) {
    console.log('error', error);
  }

  function onSubmit(data: FormSchema) {
    console.log('Form submitted:', data);
    // claim()
  }

  return (
    <div className={classRoot}>
      {isConnected ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Button
            className="w-full"
            disabled={!value || isConfirming || isClaimed}
            size="lg"
            type="submit"
          >
            {isConfirming
              ? 'Confirm on Wallet...'
              : isClaimed
                ? 'Claimed'
                : 'Claim'}
          </Button>
          <div>
            <TurnstileWidget
              className="mt-4 text-center"
              onError={handleTurnstileError}
              onExpire={handleTurnstileExpire}
              onVerify={handleTurnstileVerify}
            />
            {errors.token && <div className="mt-2">{errors.token.message}</div>}
          </div>
        </form>
      ) : (
        <WalletConnect triggerClass="w-full" triggerProps={{ size: 'lg' }} />
      )}
    </div>
  );
}
