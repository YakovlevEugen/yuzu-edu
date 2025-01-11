/**
 * EDU Testnet / Mainnet Indexing
 */

import fs from 'fs';
import { program } from '@commander-js/extra-typings';
import { type Address, isAddress } from 'viem';
import { context } from '../context';
import { getTestnetParticipantPoints } from './config';
import { countWalletTxs, indexTransactions } from './helpers';

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
