import { type Address, erc20Abi } from 'viem';
import { publicClient } from './config';

export const getTokenDecimals = (address: Address) =>
  publicClient.readContract({
    address,
    abi: erc20Abi,
    functionName: 'decimals'
  });

export const getTokenSymbol = (address: Address) =>
  publicClient.readContract({
    address,
    abi: erc20Abi,
    functionName: 'symbol'
  });

export const EMPTY_ADDRESS =
  '0x0000000000000000000000000000000000000000' as const;
