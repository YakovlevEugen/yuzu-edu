/**
 * EDU Testnet / Mainnet Indexing
 */

import fs from 'fs';
import { resolve } from 'path';
import { program } from '@commander-js/extra-typings';
import { type Address, isAddress } from 'viem';
import { context } from '../context';
import { getTestnetParticipantPoints } from './config';
import {
  type ICommunityAllocation,
  dropCommunityAllocations,
  dropCommunityRewards,
  dropFaucetWhitelist,
  dropTestnetPoints,
  insertTestnetPoints,
  updateCommunityAllocations,
  updateCommunityRewards,
  updateFaucetWhitelist,
  vCommunityAllocation,
  vCommunityReward
} from './database';
import {
  countWalletTxs,
  fromCSV,
  getTestnetActivityPoints,
  getTestnetWallets,
  indexTransactions
} from './helpers';
import { rangeToChunks } from './persistence';

program
  //
  .command('index')
  .action(async (args) => {
    await indexTransactions(context.chainId);
  });

program
  //
  .command('count-wallet-txs')
  .action(async (args) => {
    const result = await countWalletTxs(context.chainId);
    const filename = `${process.cwd()}/wallet-tx-counts-${new Date().toISOString()}.csv`;

    const lines = Array.from(result.entries())
      .sort((a, b) => (a[1] > b[1] ? -1 : a[1] < b[1] ? 1 : 0))
      .map((pair) => pair.join(','));

    fs.writeFileSync(filename, lines.join('\n'));
    console.log(`Written ${filename}.`);
  });

program
  //
  .command('get-wallet-points')
  .argument('<address>', 'wallet address')
  .action(async (address) => {
    if (!isAddress(address)) throw new Error('invalid address');
    console.log(await getTestnetParticipantPoints(address as Address));
  });

program
  //
  .command('ingest-testnet-activity-points')
  .action(async () => {
    await dropTestnetPoints();
    const list = await getTestnetActivityPoints();

    fs.writeFileSync(
      `${process.cwd()}/testnet-points-${new Date().toISOString()}.csv`,
      list.map((entry) => entry.join(',')).join('\n')
    );

    for (const chunk of rangeToChunks(0, list.length, 200)) {
      const page = list.slice(chunk.at(0), chunk.at(-1));
      await insertTestnetPoints(page);
    }
  });

program
  //
  .command('ingest-testnet-wallets')
  .action(async () => {
    await dropFaucetWhitelist();
    const list = await getTestnetWallets();

    fs.writeFileSync(
      `${process.cwd()}/faucet-eligible-wallets-${new Date().toISOString()}.csv`,
      list.join('\n')
    );

    for (const chunk of rangeToChunks(0, list.length, 200)) {
      const page = list.slice(chunk.at(0), chunk.at(-1));
      await updateFaucetWhitelist(page);
    }
  });

program
  //
  .command('ingest-community-rewards')
  .argument('<file>', 'path to csv file with community rewards')
  .action(async (path) => {
    await dropCommunityRewards();

    const rewards = fromCSV(
      fs.readFileSync(resolve(process.cwd(), path), 'utf-8'),
      vCommunityReward
    );

    for (const chunk of rangeToChunks(0, rewards.length, 200)) {
      const page = rewards.slice(chunk.at(0), chunk.at(-1));
      await updateCommunityRewards(page);
    }
  });

program
  //
  .command('ingest-community-allocations')
  .argument('<file>', 'path to csv file with community allocations')
  .action(async (path) => {
    await dropCommunityAllocations();

    const allocations = fromCSV(
      fs.readFileSync(resolve(process.cwd(), path), 'utf-8'),
      vCommunityAllocation
    ) as ICommunityAllocation[];

    for (const chunk of rangeToChunks(0, allocations.length, 200)) {
      const page = allocations.slice(chunk.at(0), chunk.at(-1));
      await updateCommunityAllocations(page);
    }
  });
