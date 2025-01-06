import { wethAbi } from 'abitype/abis';
import Big from 'big.js';
import { type Address, encodeFunctionData, getContract } from 'viem';
import type { IChainId } from '../chains';
import { getPublicClient } from '../clients';
import { getWEDUAddress } from '../helpers';
import { encodeTxRequest } from '../requests';

export const getWEDUContract = (chainId: IChainId) =>
  getContract({
    client: getPublicClient(chainId),
    address: getWEDUAddress(chainId),
    abi: wethAbi
  });

export const getWEDULogs = (params: {
  chainId: IChainId;
  fromBlock: bigint;
  toBlock: bigint;
}) => {
  const { chainId, fromBlock, toBlock } = params;
  return getPublicClient(chainId).getContractEvents({
    address: getWEDUAddress(chainId),
    abi: wethAbi,
    fromBlock,
    toBlock,
    strict: true
  });
};

export const wrapEDU = async (params: {
  chainId: IChainId;
  amount: string;
  account: Address;
}) => {
  const { chainId, amount, account } = params;
  const value = BigInt(new Big(amount).mul(10 ** 18).toFixed(0));
  const { address, abi } = getWEDUContract(chainId);
  const data = encodeFunctionData({ functionName: 'deposit', abi });
  return encodeTxRequest({ from: account, to: address, data, value });
};

export const unwrapWEDU = async (params: {
  chainId: IChainId;
  amount: string;
  account: Address;
}) => {
  const { chainId, amount, account } = params;
  const value = BigInt(new Big(amount).mul(10 ** 18).toFixed(0));
  const { address, abi } = getWEDUContract(chainId);
  const data = encodeFunctionData({
    functionName: 'withdraw',
    abi,
    args: [value]
  });
  return encodeTxRequest({ from: account, to: address, data });
};
