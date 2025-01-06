import { type Address, type Hex, getContract } from 'viem';
import { abi } from '../abi/ERC20Inbox';
import type { IChainId } from '../chains';
import { getPublicClient } from '../clients';
import { getERC20InboxAddress } from '../helpers';
import { getERC20TransfersTo } from './erc20';

export const getERC20InboxContract = (chainId: IChainId) =>
  getContract({
    client: getPublicClient(chainId),
    address: getERC20InboxAddress(chainId),
    abi
  });

export const getERC20InboxLogs = (params: {
  chainId: IChainId;
  address: Hex;
  fromBlock: bigint;
  toBlock: bigint;
}) => {
  const { chainId, fromBlock, toBlock, address } = params;
  return getPublicClient(chainId).getContractEvents({
    address,
    abi,
    fromBlock,
    toBlock,
    strict: true
  });
};

export const getERC20InboxDepositsFrom = (params: {
  chainId: IChainId;
  contracts: Address[];
  address: Address;
  fromBlock: bigint;
  toBlock: bigint;
}) => {
  const { chainId, fromBlock, toBlock, address, contracts } = params;
  return getERC20TransfersTo({
    chainId,
    addresses: contracts,
    receiver: address,
    fromBlock,
    toBlock
  });
};
