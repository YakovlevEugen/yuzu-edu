/**
 * Expose
 */

import {
  type IChain,
  eduMainnet,
  eduTestnet,
  getPublicClient,
  getWEDULogs,
  toChainId
} from '@yuzu/sdk';
import {
  createContext,
  getLastIndexedBlock,
  setLastIndexedBlock,
  toChunks,
  upsertWEDUBalance
} from './helpers';

import type { IContext, IEnv } from './types';

export const scheduled = (
  event: ScheduledEvent,
  env: IEnv,
  ctx: ExecutionContext
) => ctx.waitUntil(runScheduledJobs(createContext(event, env, ctx)));

export const runScheduledJobs = async (c: IContext) => {
  await indexBlocks(c);
};

const indexBlocks = async (c: IContext) => {
  for (const chain of [eduTestnet, eduMainnet]) {
    console.log(`Indexing ${chain.name}`);

    const [from, to] = await Promise.all([
      getLastIndexedBlock(c, chain.name),
      getPublicClient(toChainId(chain)).getBlockNumber()
    ]);

    const blockRanges = toChunks({ from, to, chunkSize: 10000 });

    for (const { fromBlock, toBlock } of blockRanges) {
      await indexWEDULogs(c, { chain, fromBlock, toBlock });
      await setLastIndexedBlock(c, chain.name, toBlock);
      break;
    }
  }
};

const indexWEDULogs = async (
  c: IContext,
  params: {
    fromBlock: bigint;
    toBlock: bigint;
    chain: IChain;
  }
) => {
  const { chain, fromBlock, toBlock } = params;

  const chainId = toChainId(chain);
  const client = getPublicClient(chainId);

  const logs = await getWEDULogs({ chainId, fromBlock, toBlock });
  console.log(`Got: ${logs.length} logs from ${fromBlock} to ${toBlock}`);

  for (const log of logs.filter((l) => !l.removed)) {
    const timestamp = await client
      .getBlock({ blockNumber: log.blockNumber })
      .then((block) => new Date(Number(block.timestamp) * 1000).toISOString());

    switch (log.eventName) {
      case 'Deposit':
        await upsertWEDUBalance(c, {
          chain,
          log,
          address: log.args.dst,
          amount: log.args.wad,
          timestamp
        });
        break;
      case 'Transfer':
        await Promise.all([
          upsertWEDUBalance(c, {
            chain,
            log,
            address: log.args.dst,
            amount: log.args.wad,
            timestamp
          }),
          upsertWEDUBalance(c, {
            chain,
            log,
            address: log.args.src,
            amount: -log.args.wad,
            timestamp
          })
        ]);
        break;
      case 'Withdrawal':
        await upsertWEDUBalance(c, {
          chain,
          log,
          address: log.args.src,
          amount: -log.args.wad,
          timestamp
        });
        break;
    }
  }
};
