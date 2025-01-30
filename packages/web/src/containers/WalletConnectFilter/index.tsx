import type { PropsWithChildren } from 'react';
import { useAccount } from 'wagmi';

import WalletConnect, { type Props } from '../WalletConnect';

export default function WalletConnectFilter({
  children,
  ...otherProps
}: PropsWithChildren<Props>) {
  const { isConnected } = useAccount();

  if (isConnected) return children;

  return <WalletConnect {...otherProps} />;
}
