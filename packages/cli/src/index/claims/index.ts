import {
  getLastIndexedMerkleClaimBlock,
  setLastIndexedMerkleClaimBlock,
  toChunks
} from '@yuzu/indexer/src/helpers';
import { indexMerkleClaimLogs } from '@yuzu/indexer/src/indexMerkleClaims';
import type { IContext } from '@yuzu/indexer/src/types';
import { eduMainnet, getChain, getPublicClient, toChainId } from '@yuzu/sdk';
import { db } from '../database';

export const createContext = () => ({ var: { db } }) as unknown as IContext;

export const ingestClaims = async (c: IContext) => {
  const chain = getChain(c.env.CONTRACTS_ENV);

  const [from, to] = await Promise.all([
    getLastIndexedMerkleClaimBlock(c, chain.name),
    getPublicClient(toChainId(chain)).getBlockNumber()
  ]);

  const blockRanges = toChunks({ from, to, chunkSize: 1000 });

  for (const { fromBlock, toBlock } of blockRanges) {
    await indexMerkleClaimLogs(c, { chain, fromBlock, toBlock });
    await setLastIndexedMerkleClaimBlock(c, chain.name, toBlock);
  }
};
