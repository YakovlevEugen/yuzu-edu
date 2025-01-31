import { zValidator } from '@hono/zod-validator';
import { getChain, unwrapWEDU, wrapEDU } from '@yuzu/sdk';
import Big from 'big.js';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import * as v from 'zod';
import {
  assert,
  createBridgeApproveDepositReq,
  createBridgeDepositReq,
  createBridgeWithdrawReq,
  execClaimTx,
  getBridgePoints,
  getBridgeTest,
  getBridgeTransfers,
  getClaimEligibility,
  getCommunityRewards,
  getCommunityRewardsByAddress,
  getCommunityRewardsHistory,
  getTestnetActivityPoints,
  getWEDUPoints,
  getWEDUTransfers,
  vAddress,
  vChainId,
  verifyCaptcha
} from './helpers';
import { database } from './middleware';
import type { IEnv } from './types';
import { getTokenBalance } from './web3';

const app = new Hono<IEnv>()
  .use(cors())
  .use(database())

  /**
   * Common
   */

  .get(
    '/balance/:chainId/:address/:symbol',
    zValidator(
      'param',
      v.object({ chainId: vChainId, address: vAddress, symbol: v.string() })
    ),
    async (c) => {
      const params = c.req.valid('param');
      const balance = await getTokenBalance(c, params);
      return c.json(balance);
    }
  )

  /**
   * Staking (WEDU)
   */

  .get(
    '/staking/:chainId/:address/points',
    zValidator('param', v.object({ chainId: vChainId, address: vAddress })),
    async (c) => {
      const { chainId, address } = c.req.valid('param');
      const chain = getChain(chainId);
      const points = await getWEDUPoints(c, chain, address);
      return c.json(points);
    }
  )

  .get(
    '/staking/:chainId/:address/history',
    zValidator('query', v.object({ page: v.string() })),
    zValidator('param', v.object({ chainId: vChainId, address: vAddress })),
    async (c) => {
      const { chainId, address } = c.req.valid('param');
      const page = parseInt(c.req.valid('query').page);
      const chain = getChain(chainId);
      const transfers = await getWEDUTransfers(c, chain, address, page);
      return c.json(transfers);
    }
  )

  .get(
    '/staking/:chainId/:address/estimate',
    zValidator('query', v.object({ value: v.string() })),
    zValidator('param', v.object({ chainId: vChainId, address: vAddress })),
    async (c) => {
      const { value } = c.req.valid('query');
      const estimate = new Big(value || 0).mul(0.05).toNumber();
      return c.json(estimate);
    }
  )

  .get(
    '/staking/:chainId/:address/wrap',
    zValidator('query', v.object({ amount: v.string() })),
    zValidator('param', v.object({ chainId: vChainId, address: vAddress })),
    async (c) => {
      const { chainId, address } = c.req.valid('param');
      const { amount } = c.req.valid('query');
      const request = await wrapEDU({ chainId, amount, account: address });
      return c.json(request);
    }
  )

  .get(
    '/staking/:chainId/:address/unwrap',
    zValidator('query', v.object({ amount: v.string() })),
    zValidator('param', v.object({ chainId: vChainId, address: vAddress })),
    async (c) => {
      const { chainId, address } = c.req.valid('param');
      const { amount } = c.req.valid('query');
      const request = await unwrapWEDU({ chainId, amount, account: address });
      return c.json(request);
    }
  )

  /**
   * Bridge (Arb <> EduChain)
   */

  .get(
    '/bridge/:parent/:child/:address/approve/:symbol/:amount',
    zValidator(
      'param',
      v.object({
        parent: vChainId,
        child: vChainId,
        address: vAddress,
        symbol: v.string(),
        amount: v.string()
      })
    ),
    async (c) => {
      const params = c.req.valid('param');
      const tx = await createBridgeApproveDepositReq(c, params);
      return c.json(tx);
    }
  )

  .get(
    '/bridge/:parent/:child/:address/deposit/:symbol/:amount',
    zValidator(
      'param',
      v.object({
        parent: vChainId,
        child: vChainId,
        address: vAddress,
        symbol: v.string(),
        amount: v.string()
      })
    ),
    zValidator('query', v.object({ ref: v.optional(v.string()) })),
    async (c) => {
      const params = c.req.valid('param');
      const { ref } = c.req.valid('query');
      const tx = await createBridgeDepositReq(c, { ...params, ref });
      return c.json(tx);
    }
  )

  .get(
    '/bridge/:parent/:child/:address/withdraw/:symbol/:amount',
    zValidator(
      'param',
      v.object({
        parent: vChainId,
        child: vChainId,
        address: vAddress,
        symbol: v.string(),
        amount: v.string()
      })
    ),
    async (c) => {
      const params = c.req.valid('param');
      const tx = await createBridgeWithdrawReq(c, params);
      return c.json(tx);
    }
  )

  .get(
    '/bridge/:chainId/:address/history',
    zValidator('param', v.object({ chainId: vChainId, address: vAddress })),
    zValidator('query', v.object({ page: v.string() })),
    async (c) => {
      const { chainId, address } = c.req.valid('param');
      const page = parseInt(c.req.valid('query').page);
      const transfers = await getBridgeTransfers(c, { chainId, address, page });
      return c.json(transfers);
    }
  )

  .get(
    '/bridge/:chainId/:address/test',
    zValidator('param', v.object({ chainId: vChainId, address: vAddress })),
    zValidator('query', v.object({ page: v.optional(v.string()) })),
    async (c) => {
      const { chainId, address } = c.req.valid('param');
      const page = parseInt(c.req.valid('query').page || '0');
      const transfers = await getBridgeTest(c, { chainId, address, page });
      return c.json(transfers);
    }
  )

  /**
   * Claim 0.1 EDU (for gas)
   */

  .get(
    '/claim/:chainId/:address/eligibility',
    zValidator('param', v.object({ chainId: vChainId, address: vAddress })),
    async (c) => {
      const { chainId, address } = c.req.valid('param');
      const eligibility = await getClaimEligibility(c, chainId, address);
      return c.json(eligibility);
    }
  )

  // NOTE: this path we would take to let users pay for gas themselves
  // .get(
  //   '/claim/:chainId/:address/tx',
  //   zValidator('param', v.object({ chainId: vChainId, address: vAddress })),
  //   async (c) => {
  //     const { chainId, address } = c.req.valid('param');
  //     const tx = await createClaimTx(c, chainId, address);
  //     return c.json(tx);
  //   }
  // )

  .post(
    '/claim/:chainId/:address/exec',
    zValidator('param', v.object({ chainId: vChainId, address: vAddress })),
    zValidator('json', v.object({ token: v.string() })),
    async (c) => {
      const { address, chainId } = c.req.valid('param');
      const { token } = c.req.valid('json');
      const ip = c.req.header('CF-Connecting-IP');
      const passed = await verifyCaptcha(c, token, ip);
      assert(passed, 'invalid catcha');
      const signature = await execClaimTx(c, chainId, address);
      return c.json(signature);
    }
  )

  /**
   * Community Rewards
   */

  .get('/rewards', async (c) => {
    const result = await getCommunityRewards(c);
    return c.json(result);
  })

  .get(
    '/rewards/:address',
    zValidator('param', v.object({ address: vAddress })),
    async (c) => {
      const { address } = c.req.valid('param');
      const result = await getCommunityRewardsByAddress(c, address);
      return c.json(result);
    }
  )

  .get(
    '/rewards/:address/history',
    zValidator('query', v.object({ page: v.string() })),
    zValidator('param', v.object({ address: vAddress })),
    async (c) => {
      const { address } = c.req.valid('param');
      const page = parseInt(c.req.valid('query').page);
      const result = await getCommunityRewardsHistory(c, address, page);
      return c.json(result);
    }
  )

  /**
   * Points Breakdown (AB Internal API)
   */

  .get(
    '/points/:chainId/:address',
    zValidator('param', v.object({ chainId: vChainId, address: vAddress })),
    async (c) => {
      const { chainId, address } = c.req.valid('param');
      const chain = getChain(chainId);
      const [staking, bridge, rewards, testnetActivity] = await Promise.all([
        getWEDUPoints(c, chain, address),
        getBridgePoints(c, chain, address),
        getCommunityRewardsByAddress(c, address),
        getTestnetActivityPoints(c, address)
      ]);
      return c.json({ staking, bridge, rewards, testnetActivity });
    }
  );

export default app;
export type IApp = typeof app;
export class Nonces {}
