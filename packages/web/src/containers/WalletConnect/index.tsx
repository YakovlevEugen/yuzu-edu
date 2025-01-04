import type { VariantProps } from 'class-variance-authority';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import WalletConnectOptions from '@/containers/WalletConnectOptions';

import { cn } from '@/helpers/lib';
import { buttonVariants } from 'ui/button';

interface Props {
  triggerClass?: string;
  triggerProps?: VariantProps<typeof buttonVariants>;
}

export default function WalletConnect({ triggerClass, triggerProps }: Props) {
  return (
    <Dialog>
      <DialogTrigger className={cn(triggerClass, buttonVariants(triggerProps))}>
        Connect wallet
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Connect</DialogTitle>
        </DialogHeader>
        <WalletConnectOptions className="mt-5" />
      </DialogContent>
    </Dialog>
  );
}
