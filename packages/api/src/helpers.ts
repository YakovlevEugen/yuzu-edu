import {
  type IChain,
  type IChainId,
  chains,
  claim,
  claimTo,
  getApproveRequest,
  getDepositRequest,
  getTokenAddress,
  getWithdrawRequest,
  hasClaimed
} from '@yuzu/sdk';
import Big from 'big.js';
import {
  type Address,
  type Hex,
  type PrivateKeyAccount,
  getAddress,
  isAddress,
  isHex
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import * as v from 'zod';
import { getNextNonce } from './nonce';
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

export const getWEDUPoints = (c: IContext, chain: IChain, address: Hex) =>
  c.var.db
    .from('wedu_agg_point_balances_view')
    .select('*')
    .eq('address', address)
    .eq('chain', chain.name)
    .maybeSingle()
    .then((res) => Number.parseFloat(res.data?.points?.toFixed(6) || '0'));

export const getWEDUTransfers = async (
  c: IContext,
  chain: IChain,
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
    .eq('chain', chain.name)
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
    parent: IChainId;
    child: IChainId;
    symbol: string;
    amount: string;
    address: Hex;
  }
) => {
  const { symbol, amount, address, parent, child } = params;
  const parentToken = getTokenAddress(parent, symbol);
  assert(parentToken, 'invalid token on parent chain');
  return getApproveRequest({
    parent,
    parentToken,
    child,
    amount,
    account: address
  });
};

export const createBridgeDepositReq = async (
  c: IContext,
  params: {
    parent: IChainId;
    child: IChainId;
    address: Address;
    symbol: string;
    amount: string;
    ref?: string;
  }
) => {
  const { parent, child, address, symbol, amount } = params;
  const parentToken = getTokenAddress(parent, symbol);
  assert(parentToken, 'invalid token on parent chain');
  return getDepositRequest({
    parent,
    parentToken,
    child,
    amount,
    account: address
  });
};

export const createBridgeWithdrawReq = async (
  c: IContext,
  params: {
    parent: IChainId;
    child: IChainId;
    address: Address;
    symbol: string;
    amount: string;
    ref?: string;
  }
) => {
  // TODO: write ref somewhere
  const { parent, child, address, symbol, amount, ref } = params;
  const parentToken = getTokenAddress(parent, symbol);
  assert(parentToken, 'invalid token on parent chain');
  return getWithdrawRequest({
    parent,
    parentToken,
    child,
    amount,
    account: address
  });
};

export const getBridgeTransfers = async (
  c: IContext,
  params: {
    chainId: IChainId;
    address: Address;
    page: number;
  }
) => {
  return []; // NOTE: wip
};

export const getBridgePoints = async (
  c: IContext,
  chain: IChain,
  address: Address
) => {
  return '0'; // NOTE: will be assigned at the end of the season
};

/**
 * Claim
 */

export const getClaimEligibility = async (
  c: IContext,
  chainId: IChainId,
  address: Address
): Promise<IEligibility> => {
  let eligiblity: IEligibility = await c.var.db
    .from('faucet_wallets')
    .select('*')
    .eq('address', getAddress(address))
    .maybeSingle()
    .then((res) => (res.data ? 'eligible' : 'not-eligible'));

  if (eligiblity === 'eligible') {
    if (await hasClaimed({ chainId, account: address })) {
      eligiblity = 'claimed';
    }
  }

  return eligiblity;
};

export const createClaimTx = async (
  c: IContext,
  chainId: IChainId,
  address: Address
) => {
  const eligibility = await getClaimEligibility(c, chainId, address);
  assert(eligibility === 'eligible');

  const signerPk =
    chainId === 'eduMainnet'
      ? c.env.MAINNET_SIGNER_PK
      : c.env.TESTNET_SIGNER_PK;

  const txRequest = await claim({
    chainId,
    account: address,
    signer: privateKeyToAccount(signerPk)
  });

  return txRequest;
};

export const execClaimTx = async (
  c: IContext,
  chainId: IChainId,
  address: Address
) => {
  const eligibility = await getClaimEligibility(c, chainId, address);
  assert(eligibility === 'eligible');

  const signerPk =
    chainId === 'eduMainnet'
      ? c.env.MAINNET_SIGNER_PK
      : c.env.TESTNET_SIGNER_PK;

  const nonce = await getNextNonce(c, chainId);

  const signature = await claimTo({
    chainId,
    account: address,
    signer: privateKeyToAccount(signerPk),
    nonce
  });

  return signature;
};

export const verifyCaptcha = (c: IContext, token: string, ip?: string) =>
  fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      secret: c.env.TURNSTILE_KEY,
      response: token,
      remoteip: ip
    })
  })
    .then((res) => res.json() as Promise<{ success: boolean }>)
    .then((res) => res.success);

/**
 * Rewards
 */

export const getCommunityRewards = async (c: IContext) =>
  c.var.db
    .from('community_rewards')
    .select('*')
    .then((res) => res.data || []);

export const getCommunityAllocations = async (c: IContext, address: Address) =>
  c.var.db
    .from('community_allocations')
    .select('*')
    .eq('address', address)
    .then((res) => res.data || []);

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
