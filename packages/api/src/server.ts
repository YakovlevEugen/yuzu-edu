import { zValidator } from '@hono/zod-validator';
import { unwrapWEDU, wrapEDU } from '@yuzu/sdk';
import { encodeTxRequest } from '@yuzu/sdk/src/requests';
import Big from 'big.js';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import * as v from 'zod';
import {
  createBridgeApproveDepositReq,
  createBridgeDepositReq,
  createBridgeWithdrawReq,
  createClaimTx,
  getBridgePoints,
  getBridgeTransfers,
  getClaimEligibility,
  getCommunities,
  getRewardsPoints,
  getWEDUPoints,
  getWEDUTransfers,
  vAddress,
  vChainId
} from './helpers';
import { database, network } from './middleware';
import type { IEnv } from './types';
import { getTokenBalance } from './web3';

const app = new Hono<IEnv>()
  .use(cors())
  .use(database())
  .use(network())

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
    '/staking/:address/points',
    zValidator('param', v.object({ address: vAddress })),
    async (c) => {
      const { address } = c.req.valid('param');
      const points = await getWEDUPoints(c, address);
      return c.json(points);
    }
  )

  .get(
    '/staking/:address/history',
    zValidator('query', v.object({ page: v.string() })),
    zValidator('param', v.object({ address: vAddress })),
    async (c) => {
      const { address } = c.req.valid('param');
      const { page } = c.req.valid('query');
      const transfers = await getWEDUTransfers(c, address, parseInt(page));
      return c.json(transfers);
    }
  )

  .get(
    '/staking/:address/estimate',
    zValidator('query', v.object({ value: v.string() })),
    zValidator('param', v.object({ address: vAddress })),
    async (c) => {
      const { address } = c.req.valid('param');
      const { value } = c.req.valid('query');
      const points = await getWEDUPoints(c, address);
      const combined = new Big(value || 0).mul(24).toNumber();
      return c.json(combined);
    }
  )

  .get(
    '/staking/:address/wrap',
    zValidator('query', v.object({ amount: v.string() })),
    zValidator('param', v.object({ address: vAddress })),
    async (c) => {
      const { address } = c.req.valid('param');
      const { amount } = c.req.valid('query');
      const chainId = c.var.mainnet ? 'eduMainnet' : 'eduTestnet';
      const request = await wrapEDU({ chainId, amount, account: address });
      return c.json(request);
    }
  )

  .get(
    '/staking/:address/unwrap',
    zValidator('query', v.object({ amount: v.string() })),
    zValidator('param', v.object({ address: vAddress })),
    async (c) => {
      const { address } = c.req.valid('param');
      const { amount } = c.req.valid('query');
      const chainId = c.var.mainnet ? 'eduMainnet' : 'eduTestnet';
      const request = await unwrapWEDU({ chainId, amount, account: address });
      return c.json(request);
    }
  )

  /**
   * Bridge (Arb <> EduChain)
   */

  .get(
    '/bridge/:address/approve/:symbol/:amount',
    zValidator(
      'param',
      v.object({
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
    '/bridge/:address/deposit/:symbol/:amount',
    zValidator(
      'param',
      v.object({
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
    '/bridge/:address/withdraw/:symbol/:amount',
    zValidator(
      'param',
      v.object({
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
    '/bridge/:address/history',
    zValidator('param', v.object({ address: vAddress })),
    zValidator('query', v.object({ page: v.string() })),
    async (c) => {
      const { address } = c.req.valid('param');
      const page = parseInt(c.req.valid('query').page);
      const transfers = await getBridgeTransfers(c, { address, page });
      return c.json(transfers);
    }
  )

  /**
   * Claim 0.1 EDU (for gas)
   */

  .get(
    '/claim/:address/eligibility',
    zValidator('param', v.object({ address: vAddress })),
    async (c) => {
      const { address } = c.req.valid('param');
      const eligibility = await getClaimEligibility(c, address);
      return c.json(eligibility);
    }
  )

  .get(
    '/claim/:address/tx',
    zValidator('param', v.object({ address: vAddress })),
    async (c) => {
      const { address } = c.req.valid('param');
      const tx = await createClaimTx(c, address);
      return c.json(tx);
    }
  )

  /**
   * Community Rewards
   */

  .get('/rewards/communities', async (c) => {
    const communities = await getCommunities(c);
    return c.json(communities);
  })

  .get(
    '/rewards/:address',
    zValidator('param', v.object({ address: vAddress })),
    async (c) => {
      const { address } = c.req.valid('param');
      const points = await getRewardsPoints(c, address);
      return c.json(points);
    }
  )

  /**
   * Points Breakdown (AB Internal API)
   */

  .get(
    '/points/:address',
    zValidator('param', v.object({ address: vAddress })),
    async (c) => {
      const { address } = c.req.valid('param');
      const [staking, bridge, rewards] = await Promise.all([
        getWEDUPoints(c, address),
        getBridgePoints(c, address),
        getRewardsPoints(c, address)
      ]);
      return c.json({ staking, bridge, rewards });
    }
  );

export default app;
export type IApp = typeof app;
