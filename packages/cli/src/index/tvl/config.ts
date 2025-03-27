import { eduMainnet, getPublicClient } from '@yuzu/sdk';
import type { Address } from 'viem';

export const chain = eduMainnet;
export const publicClient = getPublicClient('eduMainnet');

export const whitelistedTokens = [
  {
    address: '0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12',
    name: 'WRAPPED EDU',
    symbol: 'WEDU',
    type: 'ERC20',
    value: 0.16,
    decimals: 18
  },
  {
    address: '0xa572BF655F61930B6f0d4546A67cD1376220081a',
    name: 'WETH',
    symbol: 'WETH',
    type: 'ERC20',
    value: 1861.58,
    decimals: 18
  },
  {
    address: '0x7277Cc818e3F3FfBb169c6Da9CC77Fc2d2a34895',
    name: 'USDT',
    symbol: 'USDT',
    type: 'ERC20',
    value: 1,
    decimals: 6
  },
  {
    address: '0x836d275563bAb5E93Fd6Ca62a95dB7065Da94342',
    name: 'USDC',
    symbol: 'USDC',
    type: 'ERC20',
    value: 1,
    decimals: 6
  },
  {
    address: '0xAC0313F97398b585F23F8E50952F10d62350697C',
    name: 'WBTC',
    symbol: 'Wrapper bitcoin',
    type: 'ERC20',
    value: 81123.64,
    decimals: 8
  },
  {
    address: '0xd282dE0c2bd41556c887f319A5C19fF441dCdf90',
    name: 'ESD',
    symbol: 'ESD',
    type: 'ERC20',
    value: 1,
    decimals: 18
  },
  {
    address: '0x27ea362b6Be6b7299C82F1e3F61b019a697f188b',
    name: 'Blend WEDU',
    symbol: 'Blend WEDU',
    type: 'ERC20',
    value: 0.16,
    decimals: 18
  },
  {
    address: '0x7cc8157b45A927e0e313A245958441B43fed2225',
    name: 'Blend USDC',
    symbol: 'Blend USDC',
    type: 'ERC20',
    value: 1,
    decimals: 6
  },
  {
    address: '0xD23Fa3ab7B3b16763Ba8d1B2D4D07D1f28214BD1',
    name: 'Blend USDT',
    symbol: 'Blend USDT',
    type: 'ERC20',
    value: 1,
    decimals: 6
  },
  {
    address: '0xde2f0739D694f3Cbd0Ef038a7800B5Fb0cF2f01b',
    name: 'Blend WETH',
    symbol: 'Blend WETH',
    type: 'ERC20',
    value: 1861.58,
    decimals: 18
  }
] as const;

export const whitelistedLPs = [
  {
    address: '0x9CC2B9F9a6194C5CC827C88571E42cEAA76FDF47',
    name: 'Camelot LP NFT',
    symbol: 'Camelot LP NFT',
    type: 'LP'
  },
  {
    address: '0x79cc7deA5eE05735a7503A32Dc4251C7f79F3Baf',
    name: 'Sailfish LP NFT',
    symbol: 'Sailfish LP NFT',
    type: 'LP'
  }
] as const;

export type ILP = (typeof whitelistedLPs)[number];

export const sailfishPairs = {
  //USDC - WEDU
  '0x80680b0670a330a99509b68b1273f93864d4ecf4': {
    token0: '0x836d275563bAb5E93Fd6Ca62a95dB7065Da94342',
    token1: '0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12'
  },
  //USDC - USDT
  '0x27c337795022a22324188b857af777d4599560bf': {
    token0: '0x7277Cc818e3F3FfBb169c6Da9CC77Fc2d2a34895',
    token1: '0x836d275563bAb5E93Fd6Ca62a95dB7065Da94342'
  },
  // USDC - ESD
  '0x4e4a88422287a04c9Dc76f78c11f85Fa8D06B099': {
    token0: '0x836d275563bAb5E93Fd6Ca62a95dB7065Da94342',
    token1: '0xd282dE0c2bd41556c887f319A5C19fF441dCdf90'
  },
  // EDU - ESD
  '0x6bd73d7ca72174511cfaf98b7dcf84781cd0df8a': {
    token0: '0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12',
    token1: '0xd282dE0c2bd41556c887f319A5C19fF441dCdf90'
  },
  // USDT - USDC
  '0x8A9F14D4c22018921c58557505369F6E4069Ad87': {
    token0: '0x7277Cc818e3F3FfBb169c6Da9CC77Fc2d2a34895',
    token1: '0x836d275563bAb5E93Fd6Ca62a95dB7065Da94342'
  }
} as const;

export const camelotPairs = {
  // EDU - USDC
  '0x9E4Ea11eC3CbDD90A2bA74935F3267d4CE7C5e9F': {
    token0: '0x836d275563bAb5E93Fd6Ca62a95dB7065Da94342',
    token1: '0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12'
  },
  // USDT - EDU
  '0x5FF705BE9eF81C18ebD427d9a5ce971896685655': {
    token0: '0x7277Cc818e3F3FfBb169c6Da9CC77Fc2d2a34895',
    token1: '0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12'
  },
  // USDT - USDC
  '0x9309F561576A901382D3de7Fdd30e0904F7Eb857': {
    token0: '0x7277Cc818e3F3FfBb169c6Da9CC77Fc2d2a34895',
    token1: '0x836d275563bAb5E93Fd6Ca62a95dB7065Da94342'
  }
} as const;

export const nativeToken = {
  address: '0x0000000000000000000000000000000000000000',
  name: 'EDU',
  symbol: 'EDU',
  type: 'NATIVE',
  value: 0.16,
  decimals: 18
} as const;

export const getTokenPrice = (token: Address) =>
  whitelistedTokens.find((t) => t.address === token)?.value ?? 0;
