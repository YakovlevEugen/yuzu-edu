import type { IChainId } from '@yuzu/sdk';
import type { IContext, IEnv } from './types';

import type { Schema } from 'hono';
import { generateHonoObject } from 'hono-do';
import { getSignerNonce } from './web3';

export const getCurrentNonces = async (c: IContext) => {
  const id = c.env.NONCES.idFromName('default');
  const nonces = c.env.NONCES.get(id);

  const url = new URL(c.req.raw.url);
  url.pathname = '/nonces';
  const res = await nonces.fetch(url);

  return res.json() as Promise<{ testnetNonce: number; mainnetNonce: number }>;
};

export const getNextNonce = async (c: IContext, chainId: IChainId) => {
  const id = c.env.NONCES.idFromName('default');
  const nonces = c.env.NONCES.get(id);

  const url = new URL(c.req.raw.url);
  url.pathname = `/nonces/next/${chainId}`;

  return nonces
    .fetch(url)
    .then((res) => res.json() as Promise<{ nonce: number }>)
    .then((res) => res.nonce);
};

export const Nonces = generateHonoObject<IEnv, Schema, '/nonces'>(
  '/nonces',
  async (app, state, ctx) => {
    const { storage } = state;

    const [testnetTxCount, mainnetTxCount] = await Promise.all([
      getSignerNonce(ctx as IContext, 'eduTestnet'),
      getSignerNonce(ctx as IContext, 'eduMainnet')
    ]);

    let [testnetNonce, mainnetNonce] = await Promise.all([
      storage
        .get<number>('testnetNonce')
        .then((val) => Math.max(val || 0, testnetTxCount)),
      storage
        .get<number>('mainnetNonce')
        .then((val) => Math.max(val || 0, mainnetTxCount))
    ]);

    app
      .get('/', (c) =>
        c.json({
          testnetNonce,
          mainnetNonce,
          testnetTxCount,
          mainnetTxCount
        })
      )
      .get('/next/:chainId', (c) => {
        switch (c.req.param('chainId') as IChainId) {
          case 'eduMainnet':
            storage.put('mainnetNonce', mainnetNonce++);
            return c.json({ nonce: mainnetNonce });
          case 'eduTestnet':
            storage.put('testnetNonce', testnetNonce++);
            return c.json({ nonce: testnetNonce });
          default:
            throw new Error('unsupported chain');
        }
      });
  }
);
