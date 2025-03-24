import { getAddress, isAddress } from 'viem';
import * as v from 'zod';
import type { IReferral } from '../database';

export const parseReferralData = (rows: IPosthogReferral[]): IReferral[] =>
  Array.from(
    new Map<string, IReferral>(
      rows
        .map((row) => ({
          address: row['properties.address'],
          referral: row['properties.referral'],
          timestamp: row.timestamp
        }))
        .map((row) => ({
          ...row,
          referral: row.referral?.split('?ref=').pop()
        }))
        .map((row) => ({
          ...row,
          referral: row.referral?.split(')').shift()
        }))
        .filter((row) => isAddress(row.referral || ''))
        .map((row) => ({
          address: getAddress(row.address),
          referral: getAddress(row.referral as string),
          timestamp: row.timestamp
        }))
        .filter(({ address, referral }) => address !== referral)
        .map((row) => [row.address, row])
    ).values()
  );

export const vPosthogReferral = v.object({
  timestamp: v.string(),
  'properties.address': v.string(),
  'properties.referral': v.optional(v.string())
});

export type IPosthogReferral = v.infer<typeof vPosthogReferral>;
