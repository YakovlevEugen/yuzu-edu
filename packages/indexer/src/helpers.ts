import type { WorkflowEvent } from 'cloudflare:workers';
import { SupabaseClient } from '@supabase/supabase-js';
import type { IChain } from '@yuzu/sdk';
import type { Json, Tables } from '@yuzu/supabase';
import type { Hex, Log } from 'viem';
import type { IContext, IEnv, IPWPayload } from './types';

export function assert(
  statement: unknown,
  message?: string
): asserts statement {
  if (!statement) {
    throw new Error(message || 'Assertion failed');
  }
}

(BigInt.prototype as unknown as Record<string, unknown>).toJSON = function () {
  return this.toString();
};

export const createContext = (
  event: WorkflowEvent<IPWPayload>,
  env: IEnv,
  executionCtx: ExecutionContext
): IContext =>
  ({
    env,
    var: {
      db: new SupabaseClient(env.SUPABASE_URL, env.SUPABASE_KEY),
      event
    },
    executionCtx
  }) as IContext;

export const getConfigValue = <T>(
  c: IContext,
  params: { key: string; scope: string }
) =>
  c.var.db
    .from('configs')
    .select('*')
    .eq('key', params.key)
    .eq('scope', params.scope)
    .maybeSingle()
    .then((res) => {
      if (res.error) throw new Error(res.error.message);
      return res.data?.value as T;
    });

export const setConfigValue = <T extends Json | undefined>(
  c: IContext,
  params: { key: string; scope: string; value: T }
) =>
  c.var.db
    .from('configs')
    .upsert(params, { onConflict: 'key,scope', ignoreDuplicates: false })
    .then((res) => {
      if (res.error) throw new Error(res.error.message);
      return res.data;
    });

export const getShardState = <T extends Json>(
  c: IContext,
  scope: string,
  shardId: number
) =>
  getConfigValue<T | undefined>(c, { key: `shard${shardId}State`, scope }).then(
    (v) => v
  );

export const setShardState = <T extends Json>(
  c: IContext,
  scope: string,
  shardId: number,
  value: T
) => setConfigValue(c, { key: `shard${shardId}State`, scope, value });

export const getLastIndexedBlock = (c: IContext, scope: string) =>
  getConfigValue<number>(c, { key: 'lastIndexedBlock', scope }).then(
    (v) => v || 0
  );

export const setLastIndexedBlock = (
  c: IContext,
  scope: string,
  value: bigint
) =>
  setConfigValue(c, { key: 'lastIndexedBlock', scope, value: Number(value) });

export const getLastIndexedMerkleClaimBlock = (c: IContext, scope: string) =>
  getConfigValue<number>(c, { key: 'lastIndexedMerkleClaimBlock', scope }).then(
    (v) => v || 0
  );

export const setLastIndexedMerkleClaimBlock = (
  c: IContext,
  scope: string,
  value: bigint
) =>
  setConfigValue(c, {
    key: 'lastIndexedMerkleClaimBlock',
    scope,
    value: Number(value)
  });

export const toBatches = <T>(arr: T[], size: number) => {
  const out: T[][] = [];

  for (let i = 0; i < arr.length; i += size) {
    const start = i;
    const end = Math.min(i + size, arr.length);

    out.push(arr.slice(start, end));
  }

  return out;
};

export const toChunks = (params: {
  from: number | bigint;
  to: number | bigint;
  chunkSize: number;
}) => {
  const out: { fromBlock: bigint; toBlock: bigint }[] = [];
  const from = Number(params.from);
  const to = Number(params.to);
  const size = params.chunkSize;

  for (let i = from; i < to; i += size) {
    out.push({
      fromBlock: BigInt(i),
      toBlock: BigInt(Math.min(i + size, to))
    });
  }

  return out;
};

export const getUpsertWEDUBalanceOp = (
  c: IContext,
  params: {
    chain: IChain;
    log: Log;
    address: Hex;
    amount: bigint;
    timestamp: string;
  }
) => ({
  // @ts-ignore
  chain: params.chain.name,
  transactionHash: params.log.transactionHash,
  transactionIndex: params.log.transactionIndex,
  logIndex: params.log.logIndex,
  address: params.address,
  amount: params.amount.toString(),
  blockNumber: params.log.blockNumber,
  blockTimestamp: params.timestamp
});

export const upsertWEDUBalance = (
  c: IContext,
  ops: Partial<Record<string, unknown>>[]
) =>
  c.var.db
    .from('wedu_balance_changes')
    // @ts-expect-error
    .upsert(ops, {
      onConflict: 'chain,transactionHash,transactionIndex,logIndex,address',
      ignoreDuplicates: false
    })
    .then((res) => {
      if (res.error) throw new Error(res.error.message);
    });

export type IYuzuClaim = Tables<'yuzu_claims'>;

export const upsertClaims = (c: IContext, items: IYuzuClaim[]) =>
  c.var.db
    .from('yuzu_claims')
    .upsert(items, {
      onConflict: 'address,txHash,logIndex,index',
      ignoreDuplicates: false
    })
    .then((res) => {
      if (res.error) throw new Error(res.error.message);
    });
