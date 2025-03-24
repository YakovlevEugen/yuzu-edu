/**
 * Expose
 */

import {
  type IChainId,
  eduMainnet,
  getPublicClient,
  toChainId
} from '@yuzu/sdk';
import {
  assert,
  getLastIndexedBlock,
  getShardState,
  setLastIndexedBlock,
  setShardState,
  toChunks
} from './helpers';

import { indexWEDULogs } from './indexWEDULogs';
import type { IContext } from './types';

export const runScheduledJobs = async (c: IContext) => indexEduChainBlocks(c);
export const runParallelJobs = async (c: IContext) =>
  indexEduChainBlocksShard(c);

const indexEduChainBlocks = async (c: IContext) => {
  for (const chain of [eduMainnet]) {
    console.log(`Indexing ${chain.name}`);

    const [from, to] = await Promise.all([
      getLastIndexedBlock(c, chain.name),
      getPublicClient(toChainId(chain)).getBlockNumber()
    ]);

    const blockRanges = toChunks({ from, to, chunkSize: 100 });

    for (const { fromBlock, toBlock } of blockRanges) {
      await indexWEDULogs(c, { chain, fromBlock, toBlock });
      await setLastIndexedBlock(c, chain.name, toBlock);
      return; // limit single cycle to 100 blocks
    }
  }
};

const indexEduChainBlocksShard = async (c: IContext) => {
  const shardId = c.var.event?.payload.shardId;
  assert(shardId !== undefined, 'only parallel execution is allowed');

  for (const chain of [eduMainnet]) {
    console.log(`Indexing ${chain.name} as shard ${shardId}`);

    const state = await getShardState<IIndexShardState>(
      c,
      chain.name,
      shardId
    ).then((value) => value || getDefaultIndexShardState(shardId, 5));

    const [from, to] = [state.current, state.range[1]];
    const blockRanges = toChunks({ from, to, chunkSize: 100 });

    assert(blockRanges.length, 'finished indexing shard.');

    for (const { fromBlock, toBlock } of blockRanges) {
      await indexWEDULogs(c, { chain, fromBlock, toBlock });
      await setShardState<IIndexShardState>(c, chain.name, shardId, {
        ...state,
        current: Number(toBlock)
      });
      return; // limit single cycle to 100 blocks
    }
  }
};

type IIndexShardState = { range: [number, number]; current: number };

const getDefaultIndexShardState = (
  shardId: number,
  totalShards: number
): IIndexShardState => {
  const start = 4_738_953;
  const end = 10_878_910;
  const chunk = (end - start) / totalShards;

  const range = Array(totalShards)
    .fill(0)
    .map((_, i) => [
      Math.floor(start + chunk * i),
      Math.ceil(start + chunk * (i + 1) - (shardId === totalShards - 1 ? 0 : 1))
    ])[shardId] as [number, number];

  return { range, current: range[0] };
};

export const getBlockTimestamp = (chainId: IChainId) => {
  const cache = new Map<bigint, string>();
  return async (blockNumber: bigint) => {
    if (cache.has(blockNumber)) return cache.get(blockNumber) as string;

    const timestamp = await getPublicClient(chainId)
      .getBlock({ blockNumber })
      .then((block) => new Date(Number(block.timestamp) * 1000).toISOString());

    cache.set(blockNumber, timestamp);
    return timestamp;
  };
};
