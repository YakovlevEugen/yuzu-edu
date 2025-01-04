import { type Hex, defineChain } from 'viem';
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
    wedu: { address: '0x345E902846aC3805719483d80D664ABa0B6aF40C' }
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
    wedu: { address: '0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12' },
    // bridged assets
    weth: { address: '0xa572BF655F61930B6f0d4546A67cD1376220081a' },
    usdc: { address: '0x836d275563bAb5E93Fd6Ca62a95dB7065Da94342' },
    usdt: { address: '0x7277Cc818e3F3FfBb169c6Da9CC77Fc2d2a34895' }
  }
});

export const arbTestnet = defineChain({
  ...arbitrumSepolia,
  contracts: {
    edu: { address: '0x0000000000000000000000000000000000000000' },
    weth: { address: '0x2A1b409Cd444Be8F4388c50997e0Ff87e9e718Ad' },
    usdc: { address: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d' },
    usdt: { address: '0x93d67359A0f6F117150a70fDde6BB96782497248' }
  }
});

export const arbMainnet = defineChain({
  ...arbitrum,
  contracts: {
    edu: { address: '0xf8173a39c56a554837C4C7f104153A005D284D11' },
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

export const getChain = (chainId: IChainId) => chains[chainId];

export const getTokenAddress = (
  chainId: IChainId,
  symbol: string
): Hex | undefined => {
  const chain = getChain(chainId);
  const contracts = chain.contracts as Record<string, { address: Hex }>;
  return contracts[symbol.trim().toLowerCase()]?.address;
};
