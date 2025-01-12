import type { PropsWithChildren } from 'react';
import { useAccount } from 'wagmi';
import WalletConnect, { type Props } from '../WalletConnect';

export default function WalletConnectFilter(props: PropsWithChildren<Props>) {
  const { isConnected } = useAccount();
  const { children, ...rest } = props;
  if (isConnected) return <>{children}</>;
  return <WalletConnect {...rest} />;
}
