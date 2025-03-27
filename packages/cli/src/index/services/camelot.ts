import { Token } from '@uniswap/sdk-core';
import { type FeeAmount, Pool, Position } from '@uniswap/v3-sdk';
import Big from 'big.js';
import type { Address } from 'viem';
import { chain, getTokenPrice, publicClient } from '../tvl/config';
import { getTokenDecimals, getTokenSymbol } from '../tvl/web3';
import { camelotFactory } from './abis/camelotFactory';
import { camelotLPNFT } from './abis/camelotLPNFT';
import { camelotPool } from './abis/camelotPool';

export const getPositionValue = async (
  nftPos: ICamelotNFTPosition,
  pool: Pool
) => {
  const position = getPosition(nftPos, pool);

  const price0 = getTokenPrice(position.amount0.currency.address as Address);
  const price1 = getTokenPrice(position.amount1.currency.address as Address);

  const amount0 = position.amount0.toFixed();
  const amount1 = position.amount1.toFixed();

  const decimals0 = position.amount0.currency.decimals;
  const decimals1 = position.amount1.currency.decimals;

  const yield0 = new Big(nftPos.tokensOwed0.toString()).div(10 ** decimals0);
  const yield1 = new Big(nftPos.tokensOwed1.toString()).div(10 ** decimals1);

  const value0 = new Big(amount0).add(yield0).mul(price0);
  const value1 = new Big(amount1).add(yield1).mul(price1);

  return value0.add(value1).toFixed(undefined, 0);
};

export const getPool = async (
  nftPos: ICamelotNFTPosition,
  address: Address
) => {
  const [
    token0Decimals,
    token1Decimals,
    token0Symbol,
    token1Symbol,
    details,
    liquidity
  ] = await Promise.all([
    getTokenDecimals(nftPos.token0),
    getTokenDecimals(nftPos.token1),
    getTokenSymbol(nftPos.token0),
    getTokenSymbol(nftPos.token1),
    getPoolDetails(address),
    getPoolLiquidity(address)
  ]);

  return new Pool(
    new Token(chain.id, nftPos.token0, token0Decimals, token0Symbol),
    new Token(chain.id, nftPos.token1, token1Decimals, token1Symbol),
    100 as FeeAmount, // TODO
    details.price.toString(),
    liquidity.toString(),
    details.tick
  );
};

export const getPosition = (nftPos: ICamelotNFTPosition, pool: Pool) =>
  new Position({
    pool,
    liquidity: nftPos.liquidity.toString(),
    tickLower: nftPos.tickLower,
    tickUpper: nftPos.tickUpper
  });

export const getPoolLiquidity = (poolAddress: Address) =>
  publicClient.readContract({
    address: poolAddress,
    abi: camelotPool,
    functionName: 'liquidity'
  });

export const getPoolDetails = async (poolAddress: Address) => {
  const [
    price,
    tick,
    feeZto,
    feeOtz,
    timepointIndex,
    communityFeeToken0,
    communityFeeToken1,
    unlocked
  ] = await publicClient.readContract({
    address: poolAddress,
    abi: camelotPool,
    functionName: 'globalState'
  });

  return {
    price,
    tick,
    feeZto,
    feeOtz,
    timepointIndex,
    communityFeeToken0,
    communityFeeToken1,
    unlocked
  };
};

export const getPoolAddress = async ({ token0, token1 }: ICamelotNFTPosition) =>
  publicClient.readContract({
    address: chain.contracts.camelotFactory.address,
    abi: camelotFactory,
    functionName: 'poolByPair',
    args: [token0, token1]
  });

export const getNFTPosition = async (tokenId: string) => {
  const [
    nonce,
    operator,
    token0,
    token1,
    tickLower,
    tickUpper,
    liquidity,
    feeGrowthInside0LastX128,
    feeGrowthInside1LastX128,
    tokensOwed0,
    tokensOwed1
  ] = await publicClient.readContract({
    address: chain.contracts.camelotPositionManager.address,
    abi: camelotLPNFT,
    functionName: 'positions',
    args: [BigInt(tokenId)]
  });

  return {
    type: 'camelot' as const,
    nonce,
    operator,
    token0,
    token1,
    tickLower,
    tickUpper,
    liquidity,
    feeGrowthInside0LastX128,
    feeGrowthInside1LastX128,
    tokensOwed0,
    tokensOwed1
  };
};

export type ICamelotNFTPosition = Awaited<ReturnType<typeof getNFTPosition>>;
