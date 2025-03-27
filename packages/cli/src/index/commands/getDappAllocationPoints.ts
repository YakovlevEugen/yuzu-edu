import Big from 'big.js';
import type { Hex } from 'viem';
import {
  contracts,
  getEndingBlock,
  getExcludedAddresses,
  getStartingBlock
} from '../config';
import { filter, readTransactions } from '../persistence';

export const getDappAllocationPoints = async () => {
  const dappPoints = new Map<string, string>();

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
    const receiver = tx.to as Hex;

    const dapp = contracts.find((c) =>
      c.addresses.includes(receiver?.toLowerCase())
    );

    if (!dapp) continue;

    const amount = new Big(1).toFixed(18, 0);
    const dappShare = new Big(amount).mul(dapp.boost || 1).mul(0.1);
    const existingDappPoints = new Big(dappPoints.get(dapp.name) || 0);
    dappPoints.set(dapp.name, existingDappPoints.add(dappShare).toFixed(6));
  }

  return Array.from(dappPoints.entries());
};
