import type { IChainId } from '@yuzu/sdk';
import {
  getEndingBlock,
  getExcludedAddresses,
  getStartingBlock
} from './config';
import { filter, readTransactions } from './persistence';

export const countWalletTxs = async (chainId: IChainId) => {
  const index = new Map<string, number>();

  const blacklist = getExcludedAddresses(chainId);
  const startingBlock = getStartingBlock(chainId);
  const endingBlock = getEndingBlock(chainId);
  const transactions = readTransactions(chainId);

  const eligibleTxs = filter(
    transactions,
    (tx) =>
      tx.blockNumber &&
      tx.blockNumber >= startingBlock &&
      tx.blockNumber <= endingBlock &&
      !blacklist.includes(tx.from.toLowerCase())
  );

  for await (const tx of eligibleTxs) {
    const sender = tx.from.toLowerCase();

    if (index.has(sender)) {
      const value = index.get(sender) as number;
      index.set(sender, value + 1);
    } else {
      index.set(sender, 1);
    }
  }

  return index;
};
