import { arbMainnet, arbTestnet, eduMainnet, eduTestnet } from '@yuzu/sdk';
import { http, createConfig } from 'wagmi';
import type { Chain } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

type Chains = [Chain, ...Chain[]];

export const config = createConfig({
  chains: [arbMainnet, arbTestnet, eduMainnet, eduTestnet] as Chains,
  connectors: [metaMask()],
  transports: {
    [arbMainnet.id]: http(),
    [arbTestnet.id]: http(),
    [eduMainnet.id]: http(),
    [eduTestnet.id]: http()
  }
});
