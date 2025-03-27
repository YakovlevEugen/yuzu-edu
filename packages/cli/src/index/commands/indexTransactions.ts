import { type IChainId, getPublicClient } from '@yuzu/sdk';
import {
  getLastIndexedBlock,
  insertTransactions,
  rangeToChunks,
  setLastIndexedBlock
} from './persistence';

export const indexTransactions = async (chainId: IChainId) => {
  const client = getPublicClient(chainId);
  const blockNumber = await client.getBlockNumber();
  const lastIndexedBlock = getLastIndexedBlock(chainId);

  const chunks = rangeToChunks(
    Number.parseInt(lastIndexedBlock),
    Number(blockNumber),
    100
  );

  for (const chunk of chunks) {
    const transactions = await Promise.all(
      chunk.map(async (blockNumber) => {
        const block = await client.getBlock({
          includeTransactions: true,
          blockNumber: BigInt(blockNumber)
        });

        return block.transactions;
      })
    );

    const txs = transactions.flat();
    await insertTransactions(chainId, txs);

    console.log({
      since: chunk.at(0),
      until: chunk.at(-1),
      txCount: txs.length
    });

    setLastIndexedBlock(chainId, (chunk.at(-1) as number).toString());
  }
};
