/**
 * Persistence layer for Indexer
 *
 * 1. keeps track of indexed blocks
 * 2. bulk inserts all txs (blockNumber + txHash + txIndex)
 */

/**
 * State
 */

import fs from 'fs';
import readline from 'readline';
import type { IChainId } from '@yuzu/sdk';
import Big from 'big.js';
import type { Transaction } from 'viem';

(BigInt.prototype as unknown as Record<string, unknown>).toJSON = function () {
  return this.toString();
};

/**
 * Storage location
 */

export const getStoragePath = (chainId: IChainId) =>
  `${__dirname}/../../data/${chainId}`;

type IState = { lastIndexedBlock: string };

const getState = (chainId: IChainId): IState =>
  JSON.parse(fs.readFileSync(`${getStoragePath(chainId)}/state.json`, 'utf8'));

const setState = (chainId: IChainId, state: IState) => {
  const path = `${getStoragePath(chainId)}/state.json`;
  fs.writeFileSync(path, JSON.stringify(state, null, 2));
};

const updateState = (chainId: IChainId, params: Partial<IState>) =>
  setState(chainId, { ...getState(chainId), ...params });

/**
 * Last Indexed Block
 */

export const getLastIndexedBlock = (chainId: IChainId) =>
  getState(chainId).lastIndexedBlock;

export const setLastIndexedBlock = (
  chainId: IChainId,
  lastIndexedBlock: string
) => updateState(chainId, { lastIndexedBlock });

/**
 * Transactions
 */

export const insertTransactions = async (
  chainId: IChainId,
  txs: Transaction[]
) => {
  const blockNumber = txs.at(0)?.blockNumber;
  if (!blockNumber) return;

  const storageCell = new Big(blockNumber.toString()).div(100_000).toFixed(0);
  console.log({ blockNumber, storageCell });

  const storageLocation = `${getStoragePath(chainId)}/${storageCell}.jsonl`;
  const stream = fs.createWriteStream(storageLocation, { flags: 'a' });

  for (const tx of txs) stream.write(`${JSON.stringify(tx)}\n`);

  await new Promise<void>((resolve, reject) =>
    stream.close((err) => {
      if (err) reject(err);
      resolve();
    })
  );
};

/**
 * Batch
 */

export const rangeToChunks = (since: number, until: number, size: number) => {
  const out: number[][] = [];

  const numChunks = Math.ceil((until - since) / size);

  for (let i = 0; i < numChunks; i++) {
    out.push(
      Array(size)
        .fill(0)
        .map((_, index) => i * size + since + index)
        .filter((val) => val <= until)
    );
  }

  return out;
};

/**
 * Files
 */

import { resolve } from 'path';
import { Presets, SingleBar } from 'cli-progress';

export async function* readTransactions(chainId: IChainId) {
  const storagePath = getStoragePath(chainId);

  const filenames = fs
    .readdirSync(storagePath)
    .filter((path) => path.endsWith('.jsonl'));

  const progress = new SingleBar({}, Presets.shades_classic);
  progress.start(filenames.length, 0, { speed: 'n/a' });

  for (const filename of filenames) {
    progress.increment();

    const lines = readline.createInterface({
      input: fs.createReadStream(`${storagePath}/${filename}`),
      crlfDelay: Number.POSITIVE_INFINITY
    });

    for await (const line of lines) {
      if (line) {
        yield JSON.parse(line) as Transaction;
      }
    }
  }

  progress.stop();
}

/**
 * Generator utils
 */

export async function* filter<T>(
  gen: AsyncGenerator<T, void, unknown>,
  predicate: (v: T) => unknown
) {
  for await (const item of gen) {
    if (predicate(item)) {
      yield item;
    }
  }
}

/**
 * Checkpointing
 */

export const createCheckpoint = <T>(chainId: IChainId, name: string) => {
  const path = resolve(`${getStoragePath(chainId)}/${name}.json`);

  return {
    get(defaultValue?: T): T | undefined {
      return fs.existsSync(path)
        ? (JSON.parse(fs.readFileSync(path, 'utf8')) as T)
        : defaultValue;
    },
    set(value: T) {
      fs.writeFileSync(path, JSON.stringify(value, null, 2));
    }
  };
};
