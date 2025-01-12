import {
  type IChainId,
  getChain,
  getERC20Contract,
  getPublicClient,
  getTokenAddress
} from '@yuzu/sdk';
import Big from 'big.js';
import type { Hex } from 'viem';
import { assert } from './helpers';
import type { IContext } from './types';

export const getTokenBalance = async (
  c: IContext,
  params: {
    chainId: IChainId;
    address: Hex;
    symbol: string;
  }
) => {
  let { chainId, address, symbol } = params;
  const { nativeCurrency } = getChain(chainId);
  const isNativeCurrency = nativeCurrency.symbol.toLowerCase() === symbol;

  if (isNativeCurrency) {
    const client = getPublicClient(params.chainId);
    const balance = await client.getBalance({ address });
    return new Big(balance.toString()).div(1e18).toFixed(18);
  }

  if (symbol === 'eth') symbol = 'weth';

  const tokenAddress = getTokenAddress(chainId, symbol);
  assert(tokenAddress, 'token symbol not found');
  const contract = getERC20Contract(chainId, tokenAddress);

  const [balance, decimals] = await Promise.all([
    contract.read.balanceOf([address]),
    contract.read.decimals()
  ]);

  return new Big(balance.toString()).div(10 ** decimals).toFixed(decimals);
};
