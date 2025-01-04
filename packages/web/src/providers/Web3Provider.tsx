import { config } from '@/services/web3';
import type { PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';

export function Web3Provider({ children }: PropsWithChildren) {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
}
