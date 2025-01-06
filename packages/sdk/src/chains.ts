import { addresses } from '@yuzu/contracts';
import { type Address, type Chain, type Hex, defineChain } from 'viem';
import { arbitrum, arbitrumSepolia } from 'viem/chains';

export const eduTestnet = defineChain({
  id: 656476,
  name: 'EDU Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'EDU',
    symbol: 'EDU'
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.open-campus-codex.gelato.digital'],
      webSocket: ['wss://ws.open-campus-codex.gelato.digital']
    }
  },
  blockExplorers: {
    default: {
      name: 'Explorer',
      url: 'https://edu-chain-testnet.blockscout.com/'
    }
  },
  contracts: {
    edu: { address: '0x0000000000000000000000000000000000000000' },
    faucet: { address: addresses.testnet.faucet as Address },
    usdc: { address: '0xf3C3351D6Bd0098EEb33ca8f830FAf2a141Ea2E1' },
    usdt: { address: '0x089c69Dfb548B6f9dd878A0CA7718555507e2254' },
    wedu: { address: addresses.testnet.wedu as Address },
    weth: { address: '0xbA62F94e391fd0AD6f6728F75B140aa426DEa3C9' }
  }
});

export const eduMainnet = defineChain({
  id: 41923,
  name: 'EDU Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'EDU',
    symbol: 'EDU'
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.edu-chain.raas.gelato.cloud'],
      webSocket: ['wss://ws.edu-chain.raas.gelato.cloud']
    }
  },
  blockExplorers: {
    default: {
      name: 'Explorer',
      url: 'https://educhain.blockscout.com/'
    }
  },
  contracts: {
    edu: { address: '0x0000000000000000000000000000000000000000' },
    faucet: { address: null }, // TODO: addresses.mainnet.faucet
    usdc: { address: '0x836d275563bAb5E93Fd6Ca62a95dB7065Da94342' },
    usdt: { address: '0x7277Cc818e3F3FfBb169c6Da9CC77Fc2d2a34895' },
    wedu: { address: '0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12' },
    weth: { address: '0xa572BF655F61930B6f0d4546A67cD1376220081a' }
  }
});

export const arbTestnet = defineChain({
  ...arbitrumSepolia,
  contracts: {
    usdc: { address: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d' },
    usdt: { address: '0x30fA2FbE15c1EaDfbEF28C188b7B8dbd3c1Ff2eB' },
    weth: { address: '0x2A1b409Cd444Be8F4388c50997e0Ff87e9e718Ad' }
  }
});

export const arbMainnet = defineChain({
  ...arbitrum,
  contracts: {
    edu: { address: '0xf8173a39c56a554837C4C7f104153A005D284D11' },
    inbox: { address: '0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8' },
    weth: { address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' },
    usdc: { address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' },
    usdt: { address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9' }
  }
});

export type IChain =
  | typeof eduMainnet
  | typeof eduTestnet
  | typeof arbMainnet
  | typeof arbTestnet;

export type IChainName = IChain['name'];

export const chains = {
  eduMainnet,
  eduTestnet,
  arbMainnet,
  arbTestnet
} as const;

export type IChainId = keyof typeof chains;

export const toChainId = (chain: IChain) => {
  switch (chain) {
    case eduMainnet:
      return 'eduMainnet';
    case eduTestnet:
      return 'eduTestnet';
    case arbMainnet:
      return 'arbMainnet';
    case arbTestnet:
      return 'arbTestnet';
    default:
      throw new Error('unsupported chain');
  }
};

export const getChain = (chainId: IChainId): Chain => chains[chainId];

export const getTokenAddress = (
  chainId: IChainId,
  symbol: string
): Hex | undefined => {
  const chain = getChain(chainId);
  const contracts = chain.contracts as Record<string, { address: Hex }>;
  return contracts[symbol.trim().toLowerCase()]?.address;
};
