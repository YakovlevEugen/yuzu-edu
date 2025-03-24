import { Token } from '@uniswap/sdk-core';
import { type FeeAmount, Pool, Position } from '@uniswap/v3-sdk';
import Big from 'big.js';
import type { Address } from 'viem';
import { sailfishFactory } from './abis/sailfishFactory';
import { sailfishLPNFT } from './abis/sailfishLPNFT';
import { sailfishPool } from './abis/sailfishPool';
import { chain, getTokenPrice, publicClient } from './config';
import { getTokenDecimals, getTokenSymbol } from './web3';

export const getPositionValue = async (
  nftPos: ISailfishNFTPosition,
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
  nftPos: ISailfishNFTPosition,
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
    nftPos.fee as FeeAmount,
    details.sqrtPriceX96.toString(),
    liquidity.toString(),
    details.tick
  );
};

export const getPosition = (nftPos: ISailfishNFTPosition, pool: Pool) =>
  new Position({
    pool,
    liquidity: nftPos.liquidity.toString(),
    tickLower: nftPos.tickLower,
    tickUpper: nftPos.tickUpper
  });

export const getPoolLiquidity = (poolAddress: Address) =>
  publicClient.readContract({
    address: poolAddress,
    abi: sailfishPool,
    functionName: 'liquidity'
  });

export const getPoolDetails = async (poolAddress: Address) => {
  const [
    sqrtPriceX96,
    tick,
    observationIndex,
    observationCardinality,
    observationCardinalityNext,
    unused,
    unlocked
  ] = await publicClient.readContract({
    address: poolAddress,
    abi: sailfishPool,
    functionName: 'slot0'
  });

  return {
    sqrtPriceX96,
    tick,
    observationIndex,
    observationCardinality,
    observationCardinalityNext,
    unused,
    unlocked
  };
};

export const getPoolAddress = async ({
  token0,
  token1,
  fee
}: ISailfishNFTPosition) =>
  publicClient.readContract({
    address: chain.contracts.sailfishFactory.address,
    abi: sailfishFactory,
    functionName: 'getPool',
    args: [token0, token1, fee]
  });

export const getNFTPosition = async (tokenId: string) => {
  const [
    nonce,
    operator,
    token0,
    token1,
    fee,
    tickLower,
    tickUpper,
    liquidity,
    feeGrowthInside0LastX128,
    feeGrowthInside1LastX128,
    tokensOwed0,
    tokensOwed1
  ] = await publicClient.readContract({
    address: chain.contracts.sailfishPositionManager.address,
    abi: sailfishLPNFT,
    functionName: 'positions',
    args: [BigInt(tokenId)]
  });

  return {
    type: 'sailfish' as const,
    nonce,
    operator,
    token0,
    token1,
    fee,
    tickLower,
    tickUpper,
    liquidity,
    feeGrowthInside0LastX128,
    feeGrowthInside1LastX128,
    tokensOwed0,
    tokensOwed1
  };
};

export type ISailfishNFTPosition = Awaited<ReturnType<typeof getNFTPosition>>;
