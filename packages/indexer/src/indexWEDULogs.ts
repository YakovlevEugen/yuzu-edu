import { type IChain, getWEDULogs, toChainId } from '@yuzu/sdk';
import {
  getUpsertWEDUBalanceOp,
  toBatches,
  upsertWEDUBalance
} from './helpers';
import { getBlockTimestamp } from './schedule';
import type { IContext } from './types';

export const indexWEDULogs = async (
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
