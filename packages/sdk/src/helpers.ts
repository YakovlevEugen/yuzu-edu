import type { Address } from 'viem';
import {
  type IChainId,
  arbMainnet,
  arbTestnet,
  eduMainnet,
  eduTestnet
} from './chains';

export function assert(
  statement: unknown,
  message?: string
): asserts statement {
  if (!statement) {
    throw new Error(message || 'Assertion failed');
  }
}

export const getWETHAddress = (chainId: IChainId) => {
  switch (chainId) {
    case 'arbMainnet':
      return arbMainnet.contracts.weth.address;
    case 'arbTestnet':
      return arbTestnet.contracts.weth.address;
    case 'eduMainnet':
      return eduMainnet.contracts.weth.address;
    case 'eduTestnet':
      return eduTestnet.contracts.weth.address;
    default:
      throw new Error('unsupported chain');
  }
};

export const getWEDUAddress = (chainId: IChainId) => {
  switch (chainId) {
    case 'eduTestnet':
      return eduTestnet.contracts.wedu.address;
    case 'eduMainnet':
      return eduMainnet.contracts.wedu.address;
    default:
      throw new Error('unsupported chain');
  }
};

export const getFaucetAddress = (chainId: IChainId) => {
  switch (chainId) {
    case 'eduTestnet':
      return eduTestnet.contracts.faucet.address as Address;
    case 'eduMainnet':
      return eduMainnet.contracts.faucet.address as Address;
    default:
      throw new Error('unsupported chain');
  }
};

export const getERC20InboxAddress = (chainId: IChainId) => {
  switch (chainId) {
    case 'arbMainnet':
      return arbMainnet.contracts.inbox.address;
    default:
      throw new Error('unsupported chain');
  }
};

export const getMerkeClaimAddress = (chainId: IChainId) => {
  switch (chainId) {
    case 'eduMainnet':
      return eduMainnet.contracts.ocPointMerkleClaim.address;
    default:
      throw new Error('unsupported chain');
  }
};
