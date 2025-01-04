/**
 * CLI execution context (used for shared variables etc)
 */

import type { IChain, IChainId } from '@yuzu/sdk';

export type IContext = {
  verbose: boolean;
  chainId: IChainId;
  chain: IChain;
};

export const context: IContext = {
  verbose: false,
  chainId: 'eduTestnet'
} as IContext;

export const assign = (params: Partial<IContext>) =>
  Object.assign(context, params);
