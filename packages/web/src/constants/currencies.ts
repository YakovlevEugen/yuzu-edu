import { TTokens } from '@/types/common'

export const CURRENCY_TITLE: Partial<Record<TTokens, string>> = {
  arb: 'Arbitrum One',
  edu: 'EDUChain',
  usdc: 'USDC',
  usdt: 'USDT',
  yuzu: 'Yuzu',
  weth: 'Wrapped Etherium'
}

export const CURRENCY_TOKEN: Partial<Record<TTokens, string>> = {
  edu: 'EDU',
  usdc: 'USDC',
  usdt: 'USDT',
  weth: 'WETH'
}
