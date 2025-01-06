export const blockchains = {
  arb: 'Arbitrum One',
  edu: 'EDU Chain'
};

export type IBlockchain = keyof typeof blockchains;

export const tokens = {
  edu: 'EDU',
  usdc: 'USDC',
  usdt: 'USDT',
  eth: 'ETH',
  weth: 'WETH'
};

export type IToken = keyof typeof tokens;
