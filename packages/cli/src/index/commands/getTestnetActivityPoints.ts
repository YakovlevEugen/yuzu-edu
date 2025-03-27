import Big from 'big.js';
import type { Hex } from 'viem';
import {
  contracts,
  getEndingBlock,
  getExcludedAddresses,
  getStartingBlock
} from './config';
import { filter, readTransactions } from './persistence';

export const getTestnetActivityPoints = async () => {
  const points = new Map<Hex, string>();

  const blacklist = getExcludedAddresses('eduTestnet');
  const startingBlock = getStartingBlock('eduTestnet');
  const endingBlock = getEndingBlock('eduTestnet');
  const transactions = readTransactions('eduTestnet');

  const eligibleTxs = filter(
    transactions,
    (tx) =>
      tx.blockNumber &&
      tx.blockNumber >= startingBlock &&
      tx.blockNumber <= endingBlock &&
      !blacklist.includes(tx.from.toLowerCase())
  );

  for await (const tx of eligibleTxs) {
    const sender = tx.from;
    const receiver = tx.to as Hex;
    const dapp = contracts.find((c) =>
      c.addresses.includes(receiver?.toLowerCase())
    );
    const amount = dapp?.boost || 1;

    points.set(sender, new Big(amount).add(points.get(sender) || 0).toFixed(0));

    if (dapp)
      points.set(
        receiver,
        new Big(amount)
          .mul(0.1)
          .add(points.get(sender) || 0)
          .toFixed(2)
      );
  }

  return Array.from(points.entries());
};
