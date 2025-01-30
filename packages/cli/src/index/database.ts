/**
 * Testnet Points
 */

import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@yuzu/supabase';
import type { Hex } from 'viem';
import { getAddress, isAddress } from 'viem';

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

export const updateFaucetWhitelist = (entires: Hex[]) =>
  db
    .from('faucet_wallets')
    .insert(entires.map((address) => ({ address })))
    .then((res) => {
      if (res.error) throw new Error(res.error.message);
    });

export const upsertFaucetWhitelist = (entries: IAddressRow[]) =>
  db
    .from('faucet_wallets')
    .upsert(entries, { onConflict: 'address', ignoreDuplicates: true })
    .then((res) => {
      if (res.error) throw new Error(res.error.message);
    });

import * as v from 'zod';

export const vCommunityReward = v.object({
  name: v.string(),
  points: v.coerce.number()
});
export type ICommunityReward = v.infer<typeof vCommunityReward>;

export const vAddressRow = v.object({
  address: v.string().refine(isAddress)
});

export type IAddressRow = v.infer<typeof vAddressRow>;

export const vCommunityAllocation = v.object({
  address: v.string().refine(isAddress),
  community: v.string(),
  points: v.coerce.number()
});

export type ICommunityAllocation = v.infer<typeof vCommunityAllocation>;

export const updateCommunityRewards = (entries: ICommunityReward[]) =>
  db
    .from('community_rewards')
    .insert(entries)
    .then((res) => {
      if (res.error) throw new Error(res.error.message);
    });

export const updateCommunityAllocations = (entries: ICommunityAllocation[]) =>
  db
    .from('community_allocations')
    .upsert(
      entries.map(({ address, ...rest }) => ({
        address: getAddress(address),
        ...rest
      })),
      { onConflict: 'address,community', ignoreDuplicates: true }
    )
    .then((res) => {
      if (res.error) {
        console.log(res.error);
        throw new Error(res.error.message);
      }
    });

export const dropFaucetWhitelist = () =>
  db.rpc('reset_faucet_wallets').then((res) => {
    if (res.error) throw new Error(res.error.message);
  });

export const dropCommunityRewards = () =>
  db.rpc('reset_community_rewards').then((res) => {
    if (res.error) throw new Error(res.error.message);
  });

export const dropCommunityAllocations = () =>
  db.rpc('reset_community_allocations').then((res) => {
    if (res.error) throw new Error(res.error.message);
  });
