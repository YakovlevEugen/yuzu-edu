import { type Address, type Hex, erc20Abi, getContract } from 'viem';
import type { IChainId } from '../chains';
import { getPublicClient } from '../clients';

export const getERC20Contract = (chainId: IChainId, address: Hex) =>
  getContract({
    client: getPublicClient(chainId),
    address,
    abi: erc20Abi
  });

export const getERC20TransfersTo = (params: {
  chainId: IChainId;
  addresses: Address[];
  receiver: Address;
  fromBlock: bigint;
  toBlock: bigint;
}) => {
  const { chainId, addresses, receiver, fromBlock, toBlock } = params;
  return getPublicClient(chainId).getContractEvents({
    address: addresses,
    abi: erc20Abi,
    eventName: 'Transfer',
    args: { to: receiver },
    fromBlock,
    toBlock
  });
};
