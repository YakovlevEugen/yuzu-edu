import { wethAbi } from 'abitype/abis';
import { type Hex, getContract } from 'viem';
import type { IChainId } from '../chains';
import { getPublicClient } from '../clients';
import { getWETHAddress } from '../helpers';

export const getWETHContract = (chainId: IChainId) =>
  getContract({
    client: getPublicClient(chainId),
    address: getWETHAddress(chainId),
    abi: wethAbi
  });

export const getWETHLogs = (params: {
  chainId: IChainId;
  address: Hex;
  fromBlock: bigint;
  toBlock: bigint;
}) => {
  const { chainId, fromBlock, toBlock, address } = params;
  return getPublicClient(chainId).getContractEvents({
    address,
    abi: wethAbi,
    fromBlock,
    toBlock,
    strict: true
  });
};
