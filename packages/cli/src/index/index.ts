/**
 * EDU Testnet / Mainnet Indexing
 */

import fs from 'fs';
import { resolve } from 'path';
import { program } from '@commander-js/extra-typings';
import { type Address, formatEther, getAddress, isAddress } from 'viem';
import { context } from '../context';
import { getTokenHolders } from '../tvl-calculation/api';
import {
  getTokenHoldersGenerator,
  processTokenHolders
} from '../tvl-calculation/api';
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
  getPointsSnapshot,
  getTestnetActivityPoints,
  getTestnetWallets,
  indexTransactions
} from './helpers';
import { rangeToChunks } from './persistence';
import { formatPostHogReferrals } from './posthog/format';
import { ingestLPHoldersData } from './lp-tokens/ingestLPHoldersData';
import { generateLPAggregatedReport } from './lp-tokens/calculateLPValues';
import { generateLPComprehensiveReport } from './lp-tokens/lp-comprehensive-report';


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

program
  //
  .command('get-yuzu-points-snapshot')
  .action(async () => {
    const result = await getPointsSnapshot();
    const filename = `${process.cwd()}/yuzu-points-snapshot-${new Date().toISOString()}.csv`;

    const cols = ['chain', 'address', 'points', 'timestamp'];

    const rows = result
      .map((row) => cols.map((c) => row[c as keyof typeof row]).join(','))
      .join('\n');

    const csv = cols.join(',').concat('\n').concat(rows);
    fs.writeFileSync(filename, csv);
    console.log(`Written ${filename}.`);
  });

program
  //
  .command('get-token-holders')
  .action(async () => {
    const holdersData = await getTokenHolders();
    holdersData.items.forEach((item) => {
      console.log(`Address: ${item.address.hash}`);
      console.log(`Token: ${item.token.name} (${item.token.symbol})`);
      console.log(`Value: ${formatEther(BigInt(item.value))}`);
      console.log('-------------------');
    });
  });

program
  //
  .command('format-posthog-referrals')
  .action(async () => {
    const outputPath = formatPostHogReferrals();
    console.log(`Referral data written to ${outputPath}`);
  });

program
  //
  .command('format-posthog-referrals')
  .action(async () => {
    const outputPath = formatPostHogReferrals();
    console.log(`Referral data written to ${outputPath}`);
  });

program
  .command('generate-tvl-report-erc20')
  .option('-o, --output <path>', 'Output file path', './output/tvl-report-erc20.csv')
  .action(async (options) => {
    await processTokenHolders(options.output);
    console.log(`TVL report generated at: ${options.output}`);
  });


program
  .command('ingest-lp-holders')
  .option('-o, --output <path>', 'Output file path', './output/lpholders.csv')
  .option('-p, --max-pages <number>', 'Maximum number of pages to fetch', '1')
  .action(async (options: { output: string; maxPages: string }) => {
  await ingestLPHoldersData(options.output, parseInt(options.maxPages));
 });

 program.
 command('generate-lp-aggregated-report')
 .option('-o, --output <path>', 'Output file path', './output/lp-aggregated-report.csv')
 .action(async (options: { output: string }) => {
  await generateLPAggregatedReport(options.output);
 });

 program.
 command('generate-lp-comprehensive-report')
 .option('-o, --output <path>', 'Output file path', './output/lp-comprehensive-report.csv')
 .action(async (options: { output: string }) => {
  await generateLPComprehensiveReport(options.output)
 });
  

 // Add this after your other program commands
