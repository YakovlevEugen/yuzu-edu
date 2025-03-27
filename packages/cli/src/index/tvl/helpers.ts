import Big from 'big.js';
import type { Address } from 'viem';
import { batch } from '../helpers';
import {
  fetchNFTHolders,
  fetchNativeTokenHolders,
  fetchTokenHolders
} from '../services/blockscout';
import { nativeToken, whitelistedLPs, whitelistedTokens } from './config';
import { getPosition } from './positions';
import { EMPTY_ADDRESS } from './web3';

/**
 * ERC20
 */

export async function* dumpTokenHolders(
  tokenAddress?: Address,
  threshold?: number
) {
  const list = tokenAddress
    ? ([
        whitelistedTokens.find((t) => t.address === tokenAddress)
      ] as unknown as typeof whitelistedTokens)
    : whitelistedTokens;

  for (const token of list) {
    for await (const { wallet, amount } of fetchTokenHolders(
      token.address,
      threshold
    )) {
      yield {
        wallet,
        token: token.address,
        symbol: token.symbol,
        amount,
        value: new Big(amount).mul(token.value).toFixed(undefined, 0)
      };
    }
  }
}

/**
 * Native
 */

export async function* dumpNativeHolders(threshold: number) {
  for await (const { wallet, amount } of fetchNativeTokenHolders(threshold)) {
    yield {
      wallet,
      token: nativeToken.address,
      symbol: nativeToken.symbol,
      amount,
      value: new Big(amount).mul(nativeToken.value).toFixed(undefined, 0)
    };
  }
}

/**
 * LPs
 */

export async function* dumpLPHoldings() {
  for (const token of whitelistedLPs) {
    const stream = batch(fetchNFTHolders(token.address), 10);
    for await (const chunk of stream) {
      for (const position of await Promise.all(
        chunk.map(({ wallet, tokenId }) => {
          if (wallet === EMPTY_ADDRESS) return;
          return getPosition({ wallet, token, tokenId });
        })
      )) {
        if (position) yield position;
      }
    }
  }
}

/**
 * Types
 */

export type IHolderData = {
  wallet: Address;
  token: Address;
  symbol: string;
  amount: string; // balance
  value: string; // usd
};
