import posthog from 'posthog-js';
import { useConnect } from 'wagmi';

import { Button } from 'ui/button';

import { cn } from '@/helpers/lib';

interface Props {
  className?: string;
}

export default function WalletConnectOptions({ className }: Props) {
  const { connectors, connect } = useConnect({
    onSuccess(data) {
      console.log('Connected to wallet:', data);
      posthog?.capture(`Connect to ${data}`);
    },
    onError(error) {
      console.error('Error connecting to wallet:', error);
    }
  });

  const classRoot = cn('flex flex-col gap-y-3', className);

  return (
    <div className={classRoot}>
      {Boolean(connectors?.length) &&
        connectors.map((connector) => (
          <Button key={connector.uid} onClick={() => connect({ connector })}>
            {connector.name}
          </Button>
        ))}
    </div>
  );
}
