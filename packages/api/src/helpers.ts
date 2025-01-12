import {
  type IChainId,
  chains,
  getApproveRequest,
  getDepositRequest,
  getTokenAddress,
  getWithdrawRequest
} from '@yuzu/sdk';
import Big from 'big.js';
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

export const getWEDUPoints = (c: IContext, chain: string, address: Hex) =>
  c.var.db
    .from('wedu_agg_point_balances_view')
    .select('*')
    .eq('address', address)
    .eq('chain', chain)
    .maybeSingle()
    .then((res) => Number.parseFloat(res.data?.points?.toFixed(6) || '0'));

export const getWEDUTransfers = async (
  c: IContext,
  chain: string,
  address: Hex,
  page: number
) => {
  const limit = 5;
  const from = page * limit;
  const to = (page + 1) * limit - 1;

  return c.var.db
    .from('wedu_point_balances_view')
    .select('blockTimestamp,amount,points')
    .eq('address', address)
    .eq('chain', chain)
    .order('blockTimestamp', { ascending: false })
    .range(from, to)
    .then(
      (res) =>
        res.data?.map((item) => ({
          timestamp: new Date(item.blockTimestamp as string).toISOString(),
          amount: new Big(item.amount as number).div(1e18).toFixed(18),
          points: new Big(item.points as number).toFixed(6)
        })) || []
    );
};

/**
 * Bridge
 */

export const createBridgeApproveDepositReq = async (
  c: IContext,
  params: {
    symbol: string;
    amount: string;
    address: Hex;
  }
) => {
  const { symbol, amount, address: account } = params;
  const parent = c.var.mainnet ? 'arbMainnet' : 'arbTestnet';
  const child = c.var.mainnet ? 'eduMainnet' : 'eduTestnet';
  const parentToken = getTokenAddress(parent, symbol);
  assert(parentToken, 'invalid token on parent chain');
  return getApproveRequest({
    parent,
    parentToken,
    child,
    amount,
    account
  });
};

export const createBridgeDepositReq = async (
  c: IContext,
  params: {
    address: Address;
    symbol: string;
    amount: string;
    ref?: string;
  }
) => {
  const { address: account, symbol, amount } = params;
  const parent = c.var.mainnet ? 'arbMainnet' : 'arbTestnet';
  const child = c.var.mainnet ? 'eduMainnet' : 'eduTestnet';
  const parentToken = getTokenAddress(parent, symbol);
  assert(parentToken, 'invalid token on parent chain');
  return getDepositRequest({ parent, parentToken, child, account, amount });
};

export const createBridgeWithdrawReq = async (
  c: IContext,
  params: {
    address: Address;
    symbol: string;
    amount: string;
    ref?: string;
  }
) => {
  const { address: account, symbol, amount, ref } = params;
  const parent = c.var.mainnet ? 'arbMainnet' : 'arbTestnet';
  const child = c.var.mainnet ? 'eduMainnet' : 'eduTestnet';
  const parentToken = getTokenAddress(parent, symbol);
  assert(parentToken, 'invalid token on parent chain');
  return getWithdrawRequest({ parent, parentToken, child, account, amount });
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

/**
 * Testnet activity
 */

export const getTestnetActivityPoints = async (c: IContext, address: string) =>
  c.var.db
    .from('testnet_points')
    .select('*')
    .eq('address', address)
    .maybeSingle()
    .then((res) => new Big(res.data?.points || 0).toFixed(6));
