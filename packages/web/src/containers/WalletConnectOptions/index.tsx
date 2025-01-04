import { useConnect } from 'wagmi';

import { Button } from 'ui/button';

import { cn } from '@/helpers/lib';

interface Props {
  className?: string;
}

export default function WalletConnectOptions({ className }: Props) {
  const { connectors, connect } = useConnect();

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
