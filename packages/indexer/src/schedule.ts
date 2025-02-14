/**
 * Expose
 */

import {
  type IChain,
  type IChainId,
  arbMainnet,
  eduMainnet,
  eduTestnet,
  getERC20InboxAddress,
  getERC20InboxDepositsFrom,
  getPublicClient,
  getWEDULogs,
  toChainId
} from '@yuzu/sdk';
import {
  createContext,
  getLastIndexedBlock,
  getUpsertWEDUBalanceOp,
  setLastIndexedBlock,
  toBatches,
  toChunks,
  upsertWEDUBalance
} from './helpers';

import type { IContext, IEnv } from './types';

export const scheduled = (
  event: ScheduledEvent,
  env: IEnv,
  ctx: ExecutionContext
) => ctx.waitUntil(runScheduledJobs(createContext(event, env, ctx)));

export const runScheduledJobs = async (c: IContext) =>
  Promise.all([indexEduChainBlocks(c)]); // indexArbitrumBlocks(c)

// const indexArbitrumBlocks = async (c: IContext) => {
//   for (const chain of [arbMainnet]) {
//     console.log(`Indexing ${chain.name}`);

//     const [from, to] = await Promise.all([
//       getLastIndexedBlock(c, chain.name),
//       getPublicClient(toChainId(chain)).getBlockNumber()
//     ]);

//     const blockRanges = toChunks({ from, to, chunkSize: 10000 });

//     for (const { fromBlock, toBlock } of blockRanges) {
//       await indexERC20InboxLogs(c, { chain, fromBlock, toBlock });
//       await setLastIndexedBlock(c, chain.name, toBlock);
//       break;
//     }
//   }
// };

// const indexERC20InboxLogs = async (
//   c: IContext,
//   params: {
//     fromBlock: bigint;
//     toBlock: bigint;
//     chain: IChain;
//   }
// ) => {
//   const { chain, fromBlock, toBlock } = params;

//   const chainId = toChainId(chain);
//   const client = getPublicClient(chainId);

//   const logs = await getERC20InboxDepositsFrom({
//     chainId,
//     fromBlock,
//     toBlock,
//     contracts: [
//       // edu
//       // weth
//       // usdc
//       // usdt
//     ],
//     address: getERC20InboxAddress(chainId)
//   });

//   console.log(`Got: ${logs.length} logs from ${fromBlock} to ${toBlock}`);

//   for (const log of logs.filter((l) => !l.removed)) {
//     const timestamp = await client
//       .getBlock({ blockNumber: log.blockNumber })
//       .then((block) => new Date(Number(block.timestamp) * 1000).toISOString());

//     switch (log.eventName) {
//       case 'Transfer':
//         await Promise.all([
//           upsertWEDUBalance(c, {
//             chain,
//             log,
//             address: log.args.from,
//             amount: log.args.value,
//             timestamp
//           }),
//           upsertWEDUBalance(c, {
//             chain,
//             log,
//             address: log.args.src,
//             amount: -log.args.wad,
//             timestamp
//           })
//         ]);
//         break;
//     }
//   }
// };

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

const getBlockTimestamp = (chainId: IChainId) => {
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

  const logs = await getWEDULogs({ chainId, fromBlock, toBlock });
  console.log(`Got: ${logs.length} logs from ${fromBlock} to ${toBlock}`);

  const getTimestamp = getBlockTimestamp(chainId);

  const out: Partial<object>[] = [];

  const filteredLogs = logs.filter((l) => !l.removed);
  for (const batch of toBatches(filteredLogs, 10)) {
    await Promise.all(
      batch.map(async (log) => {
        const timestamp = await getTimestamp(log.blockNumber);
        console.log(log.blockNumber, timestamp);

        switch (log.eventName) {
          case 'Deposit':
            out.push(
              getUpsertWEDUBalanceOp(c, {
                chain,
                log,
                address: log.args.dst,
                amount: log.args.wad,
                timestamp
              })
            );
            break;
          case 'Transfer':
            out.push(
              getUpsertWEDUBalanceOp(c, {
                chain,
                log,
                address: log.args.dst,
                amount: log.args.wad,
                timestamp
              })
            );
            out.push(
              getUpsertWEDUBalanceOp(c, {
                chain,
                log,
                address: log.args.src,
                amount: -log.args.wad,
                timestamp
              })
            );
            break;
          case 'Withdrawal':
            out.push(
              getUpsertWEDUBalanceOp(c, {
                chain,
                log,
                address: log.args.src,
                amount: -log.args.wad,
                timestamp
              })
            );
            break;
        }
      })
    );
  }

  for (const batch of toBatches(out, 100)) {
    await upsertWEDUBalance(c, batch);
  }
};
