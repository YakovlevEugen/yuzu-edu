/**
 * EDU Testnet / Mainnet Indexing
 */

import fs from 'fs';
import { resolve } from 'path';
import { program } from '@commander-js/extra-typings';
import { type Address, getAddress, isAddress } from 'viem';
import { context } from '../context';
import { getTestnetParticipantPoints } from './config';
import { getDappAllocationPoints } from './dapps';
import {
  type IAddressRow,
  type ICommunityAllocation,
  dropFaucetWhitelist,
  dropTestnetPoints,
  insertTestnetPoints,
  updateCommunityAllocations,
  updateFaucetWhitelist,
  upsertFaucetWhitelist,
  vAddressRow,
  vCommunityAllocation
} from './database';
import {
  countWalletTxs,
  fromCSV,
  getTestnetActivityPoints,
  getTestnetWallets,
  indexTransactions
} from './helpers';
import { rangeToChunks } from './persistence';
import { formatPostHogReferrals } from './posthog/format';

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
  .command('upsert-testnet-wallets')
  .argument('<file>', 'path to csv with additional testnet wallet')
  .action(async (path) => {
    const wallets = fromCSV(
      fs.readFileSync(resolve(process.cwd(), path), 'utf-8'),
      vAddressRow
    );

    for (const chunk of rangeToChunks(0, wallets.length, 200)) {
      const page = wallets.slice(chunk.at(0), chunk.at(-1)) as IAddressRow[];
      await upsertFaucetWhitelist(page);
    }
  });

program
  //
  .command('ingest-community-allocations')
  .argument('<file>', 'path to csv file with community allocations')
  .action(async (path) => {
    // await dropCommunityAllocations();

    let allocations = fromCSV(
      fs.readFileSync(resolve(process.cwd(), path), 'utf-8'),
      vCommunityAllocation
    ) as ICommunityAllocation[];

    const seen = new Set();
    allocations = allocations.filter(({ address, community }) => {
      const key = `${getAddress(address)}-${community}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    for (const chunk of rangeToChunks(0, allocations.length, 200)) {
      const page = allocations.slice(chunk.at(0), chunk.at(-1));
      await updateCommunityAllocations(page);
    }
  });

program
  //
  .command('get-testnet-dapps-allocations')
  .action(async () => {
    const result = await getDappAllocationPoints();
    const filename = `${process.cwd()}/dapps-points-${new Date().toISOString()}.csv`;

    const lines = Array.from(result.entries())
      .sort((a, b) => (a[1] > b[1] ? -1 : a[1] < b[1] ? 1 : 0))
      .map((pair) => pair.join(','));

    fs.writeFileSync(filename, lines.join('\n'));
    console.log(`Written ${filename}.`);
  });

program.command('format-posthog-referrals').action(async () => {
  const outputPath = formatPostHogReferrals();
  console.log(`Referral data written to ${outputPath}`);
});
