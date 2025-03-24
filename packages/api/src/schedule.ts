import { getChain, getPublicClient, toChainId } from '@yuzu/sdk';
import type { Json } from '@yuzu/supabase';
import type { IContext } from './types';

export const indexClaims = (c: IContext) => ingestClaims(c);

const ingestClaims = async (c: IContext) => {
  const chain = getChain(c.env.CONTRACTS_ENV);

  const [from, to] = await Promise.all([
    getLastIndexedMerkleClaimBlock(c, chain.name),
    getPublicClient(toChainId(chain)).getBlockNumber()
  ]);

  const blockRanges = toChunks({ from, to, chunkSize: 1000 });

  for (const { fromBlock, toBlock } of blockRanges) {
    await indexMerkleClaimLogs(c, { chain, fromBlock, toBlock });
    await setLastIndexedMerkleClaimBlock(c, chain.name, toBlock);
  }
};

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
