/**
 * Testnet Points
 */

import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@yuzu/supabase';
import type { Hex } from 'viem';
import { getAddress } from 'viem';

import { resolve } from 'path';
import dotnet from 'dotenv';
dotnet.config({ path: resolve(__dirname, '..', '..', '.env') });

const db = new SupabaseClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

export const insertTestnetPoints = (entries: [Hex, string][]) =>
  db
    .from('testnet_points')
    .insert(
      entries.map(([address, points]) => ({
        address: getAddress(address),
        points: parseFloat(points)
      }))
    )
    .then((res) => {
      if (res.error) throw new Error(res.error.message);
    });

export const dropTestnetPoints = () =>
  db.rpc('reset_testnet_points').then((res) => {
    if (res.error) throw new Error(res.error.message);
  });

export const updateFaucetWhitelist = (entires: [Hex, string][]) =>
  db
    .from('faucet_wallets')
    .insert(entires.map(([address]) => ({ address: getAddress(address) })))
    .then((res) => {
      if (res.error) throw new Error(res.error.message);
    });

export const dropFaucetWhitelist = () =>
  db.rpc('reset_faucet_wallets').then((res) => {
    if (res.error) throw new Error(res.error.message);
  });
