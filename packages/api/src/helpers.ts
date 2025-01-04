import { type IChainId, chains } from '@yuzu/sdk';
import { type Address, type Hex, isAddress, isHex } from 'viem';
import * as v from 'zod';
import type { IContext, IEligibility } from './types';

/**
 * General
 */

export function assert(
  statement: unknown,
  message?: string
): asserts statement {
  if (!statement) {
    throw new Error(message || 'Assertion failed');
  }
}

export const isChainId = (chainId: string): chainId is IChainId =>
  chainId in chains;

export const vAddress = v.string().refine<Address>(isAddress);
export const vHex = v.string().refine<Hex>(isHex);
export const vChainId = v.string().refine<IChainId>(isChainId);

/**
 * Staking
 */

export const getWEDUPoints = (c: IContext, address: Hex) =>
  c.var.db
    .from('wedu_agg_point_balances_view')
    .select('*')
    .eq('address', address)
    .maybeSingle()
    .then((res) => Number.parseFloat(res.data?.points?.toFixed(6) || '0'));

export const getWEDUTransfers = async (
  c: IContext,
  address: Hex,
  page: number
) => {
  return [
    {
      timestamp: new Date().toISOString(),
      amount: '1000000000000000000000',
      points: '1000'
    }
  ];
};

/**
 * Bridge
 */

export const createBridgeTx = async (
  c: IContext,
  params: {
    address: Address;
    source: IChainId;
    target: IChainId;
    symbol: string;
    amount: string;
    ref?: string;
  }
) => {
  // write referral request for a given wallet for given params

  return '';
};

export const getBridgeTransfers = async (
  c: IContext,
  params: {
    address: Address;
    page: number;
  }
) => {
  return [];
};

export const getBridgePoints = async (c: IContext, address: Address) => {
  return '0';
};

/**
 * Claim
 */

export const getClaimEligibility = async (
  c: IContext,
  address: Address
): Promise<IEligibility> => {
  return 'eligible';
};

export const createClaimTx = async (c: IContext, address: Address) => {
  const eligibility = await getClaimEligibility(c, address);
  assert(eligibility === 'eligible');

  // const signature = await getWithdrawalSignature({ client, signer, params });

  return '';
};

/**
 * Rewards
 */

export const getCommunities = async (c: IContext) => {
  return [];
};

export const getRewardsPoints = async (c: IContext, address: string) => {
  return '0;';
};
