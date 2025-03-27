import { type IChain, getMerkleClaimLogs, toChainId } from '@yuzu/sdk';
import { type Hex, getAddress } from 'viem';
import { toBatches, upsertClaims } from './helpers';
import type { IContext } from './types';

export const indexMerkleClaimLogs = async (
  c: IContext,
  params: {
    fromBlock: bigint;
    toBlock: bigint;
    chain: IChain;
  }
) => {
  const { chain, fromBlock, toBlock } = params;
  const chainId = toChainId(chain);

  const logs = await getMerkleClaimLogs({
    chainId,
    fromBlock,
    toBlock,
    rpcUrl: c.env.EDUCHAIN_RPC_URL
  });

  console.log(`Got: ${logs.length} logs from ${fromBlock} to ${toBlock}`);

  for (const batch of toBatches(logs, 100)) {
    await upsertClaims(
      c,
      batch.flatMap((item) =>
        item.args.amounts.map((amount, index) => ({
          address: item.address,
          txHash: item.transactionHash,
          logIndex: item.logIndex,
          index,
          chain: chain.name,
          blockNumber: Number(item.blockNumber),
          recipient: getAddress(item.args.recipient),
          amount: amount.toString(),
          depositReasonCode: item.args.depositReasonCodes.at(index) as Hex,
          indexedAt: new Date().toISOString()
        }))
      )
    );
  }
};
