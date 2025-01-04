import type { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

import { config } from '@/services/web3';

interface Props {
  children?: ReactNode;
}

export function Web3Provider({ children }: Props) {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
}
