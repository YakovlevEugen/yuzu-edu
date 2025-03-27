import type { IChainId } from '@yuzu/sdk';
import { type Address, type Hex, type Transaction, getAddress } from 'viem';
import {
  getEndingBlock,
  getExcludedAddresses,
  getStartingBlock
} from './config';
import { getYuzuPointsPage } from './database';
import { filter, readTransactions } from './persistence';

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

export const getPointsSnapshot = async () => {
  let result: {
    address: string | null;
    chain: string | null;
    points: number | null;
    timestamp: string | null;
  }[] = [];

  const out: {
    address: string | null;
    chain: string | null;
    points: number | null;
    timestamp: string | null;
  }[] = [];

  let page = 0;

  do {
    result = await getYuzuPointsPage(page);
    result.forEach((item) => out.push(item));
    page++;
  } while (result.length);

  return out;
};

export const toCSV = <T extends object>(items: T[]) => {
  const header = [...new Set(items.flatMap((item) => Object.keys(item)))];
  const rows = items
    .map((item) => header.map((k) => item[k as keyof typeof item]).join(','))
    .join('\n');

  return [header.join(','), rows].join('\n');
};

export async function* sequence<T>(...items: AsyncIterableIterator<T>[]) {
  for await (const item of items) yield* item;
}

export async function* batch<T>(
  iterable: AsyncIterableIterator<T>,
  batchSize: number
) {
  let items: T[] = [];
  for await (const item of iterable) {
    items.push(item);
    if (items.length >= batchSize) {
      yield items;
      items = [];
    }
  }
  if (items.length !== 0) {
    yield items;
  }
}

export async function* inspect<T>(iterable: AsyncIterableIterator<T>) {
  for await (const item of iterable) {
    console.log(item);
    yield item;
  }
}

export const collect = async <T>(iterable: AsyncIterableIterator<T>) => {
  const out: T[] = [];

  for await (const item of iterable) {
    out.push(item);
  }

  return out;
};

export async function* map<T, U>(
  iterable: AsyncIterableIterator<T>,
  fn: (item: T) => U
) {
  for await (const item of iterable) {
    yield fn(item);
  }
}

export async function* mapAsync<T, U>(
  iterable: AsyncIterableIterator<T>,
  fn: (item: T) => U
) {
  for await (const item of iterable) {
    yield await fn(item);
  }
}

export async function* flatMap<T, U>(
  iterable: AsyncIterableIterator<T>,
  fn: (item: T) => U[]
) {
  for await (const item of iterable) {
    const results = fn(item);
    for (const result of results) yield result;
  }
}

export async function* flatMapAsync<T, U>(
  iterable: AsyncIterableIterator<T>,
  fn: (item: T) => Promise<U[]>
) {
  for await (const item of iterable) {
    const results = await fn(item);
    for (const result of results) yield result;
  }
}

export async function* filterAsync<T>(
  iterable: AsyncIterableIterator<T>,
  fn: (item: T) => Promise<boolean>
) {
  for await (const item of iterable) {
    const result = await fn(item);
    if (result) yield item;
  }
}

export async function* dedup<T>(iterable: AsyncIterableIterator<T>) {
  const set = new Set<T>();

  for await (const item of iterable) {
    if (!set.has(item)) {
      set.add(item);
      yield item;
    }
  }
}

import fs from 'fs';
import type * as v from 'zod';

export async function* readCSV<T>(path: string, schema: v.Schema<T>) {
  const file = fs.readFileSync(path, 'utf-8');
  const lines = file.split('\n');
  const header = lines.shift()?.split(',') as string[];

  for (const line of lines) {
    const values = line.split(',').map((col) => col.trim());
    const obj = Object.fromEntries(
      header.map((col, index) => [col, values[index]])
    );
    yield schema.parse(obj);
  }
}

export async function writeJson<T>(
  path: string,
  iterable: AsyncIterableIterator<T>
) {
  const stream = fs.createWriteStream(path);

  for await (const item of iterable) {
    stream.write(JSON.stringify(item) + '\n');
  }

  return new Promise<void>((resolve, reject) =>
    stream.close((err) => {
      if (err) return reject(err);
      resolve();
    })
  );
}

export const sleep = (sec: number) =>
  new Promise((r) => setTimeout(r, sec * 1000));
