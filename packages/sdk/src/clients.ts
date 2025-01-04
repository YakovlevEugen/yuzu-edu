import {
  http,
  type Account,
  type Hex,
  createPublicClient,
  createWalletClient
} from 'viem';
import { type IChainId, getChain } from './chains';

export const getPublicClient = (chainId: IChainId) =>
  createPublicClient({
    chain: getChain(chainId),
    transport: http(undefined, {
      retryCount: 100,
      retryDelay: 10000
    })
  });

export const getWalletClient = (chainId: IChainId, account: Hex | Account) =>
  createWalletClient({
    chain: getChain(chainId),
    transport: http(),
    account
  });
