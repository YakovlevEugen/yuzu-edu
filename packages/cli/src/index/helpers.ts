import { type IChainId, getPublicClient } from '@yuzu/sdk';
import Big from 'big.js';
import { type Address, type Hex, type Transaction, getAddress } from 'viem';
import {
  contracts,
  getEndingBlock,
  getExcludedAddresses,
  getStartingBlock
} from './config';
import {
  filter,
  getLastIndexedBlock,
  insertTransactions,
  rangeToChunks,
  readTransactions,
  setLastIndexedBlock
} from './persistence';

export const indexTransactions = async (chainId: IChainId) => {
  const client = getPublicClient(chainId);
  const blockNumber = await client.getBlockNumber();
  const lastIndexedBlock = getLastIndexedBlock(chainId);

  const chunks = rangeToChunks(
    Number.parseInt(lastIndexedBlock),
    Number(blockNumber),
    100
  );

  for (const chunk of chunks) {
    const transactions = await Promise.all(
      chunk.map(async (blockNumber) => {
        const block = await client.getBlock({
          includeTransactions: true,
          blockNumber: BigInt(blockNumber)
        });

        return block.transactions;
      })
    );

    const txs = transactions.flat();
    await insertTransactions(chainId, txs);

    console.log({
      since: chunk.at(0),
      until: chunk.at(-1),
      txCount: txs.length
    });

    setLastIndexedBlock(chainId, (chunk.at(-1) as number).toString());
  }
};

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

export const getWalletTxs = async (chainId: IChainId, address: Address) => {
  const set = new Set<Transaction>();

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

    if (sender === address) {
      set.add(tx);
    }
  }

  return Array.from(set);
};

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

export const getTestnetWallets = async () => {
  const wallets = new Set<Hex>();

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
    if (sender) wallets.add(getAddress(sender));
  }

  return Array.from(wallets);
};

export const fromCSV = <T>(text: string, schema: Zod.Schema<T>) => {
  const [headerRow, ...lines] = text.split('\n');

  const cols = headerRow
    .split(',')
    .map((str) => str.trim())
    .filter(Boolean);

  const rows = lines
    .map((line) =>
      line
        .split(',')
        .map((str) => str.trim())
        .filter(Boolean)
    )
    .map((values) => Object.fromEntries(cols.map((c, i) => [c, values[i]])))
    .map((row, index) => {
      const result = schema.safeParse(row);
      if (result.success) return result.data;
      throw new Error(`failed to parse row:${index}, ${result.error.message}`);
    });

  return rows;
};
