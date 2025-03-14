import { whitelistedTokens } from '../../tvl-calculation/constant';
import { getLPNFTdata } from './getLPNFTdata';
import { BigNumber } from 'bignumber.js';
import { getPoolAddress } from './getPoolAddress';
import { getCurrentTick } from './getCurrentTick';
interface UniswapV3Position {
  nonce: string;
  operator: string;
  token0: string;
  token1: string;
  tickLower: number;
  tickUpper: number;
  liquidity: string;
  feeGrowthInside0LastX128: string;
  feeGrowthInside1LastX128: string;
  tokensOwed0: string;
  tokensOwed1: string;
}

interface TokenInfo {
  address: string;
  value: number;
  decimals: number;
}

/**
 * Calculates the USD value of a Uniswap V3 position
 * @param position The Uniswap V3 position data
 * @param currentTick The current tick of the pool (if not provided, uses middle of range)
 * @returns The USD value of the position
 */
export async function calculatePositionValue( contractAddressLPNFT: string, positionID: number): Promise<number> {
  const position = await getLPNFTdata({
    positionID: positionID,
    contractAddressLPNFT: contractAddressLPNFT
  })
  // Find token info from whitelisted tokens
  const token0Info = whitelistedTokens.find(t => 
    t.address.toLowerCase() === position.token0.toLowerCase()
  ) as TokenInfo;
  console.log("Token 0: ", token0Info)
  
  const token1Info = whitelistedTokens.find(t => 
    t.address.toLowerCase() === position.token1.toLowerCase()
  ) as TokenInfo;
  console.log("Token 1: ", token1Info)
  if (!token0Info || !token1Info) {
    throw new Error('Token not found in whitelisted tokens');
  }
  
  // Set default decimals if not provided

  const token0Decimals = token0Info.decimals ;
  const token1Decimals = token1Info.decimals ;
  
  const isSailfish = contractAddressLPNFT === "0x79cc7deA5eE05735a7503A32Dc4251C7f79F3Baf";
  // GET TICK FROM POOL HERE
  const poolAddress = getPoolAddress(token0Info.address, token1Info.address, isSailfish);
  console.log("Pool Address: ", poolAddress)
  const currentTick = await getCurrentTick(poolAddress as string)
  console.log("Current Tick: ", currentTick)
  // Convert liquidity to BigNumber for precision
  const liquidity = new BigNumber(position.liquidity);
  
  // Calculate square roots
  const sqrtPriceA = Math.sqrt(Math.pow(1.0001, position.tickLower));
  const sqrtPriceB = Math.sqrt(Math.pow(1.0001, position.tickUpper));
  const sqrtPrice = Math.sqrt(Math.pow(1.0001, currentTick as number));
  
  let amount0 = new BigNumber(0);
  let amount1 = new BigNumber(0);
  
  // Calculate token amounts based on current price position
  if (currentTick as number <= position.tickLower) {
    // All liquidity is in token0
    amount0 = liquidity.multipliedBy(sqrtPriceB - sqrtPriceA).dividedBy(sqrtPriceA * sqrtPriceB);
  } else if (currentTick as number >= position.tickUpper) {
    // All liquidity is in token1
    amount1 = liquidity.multipliedBy(sqrtPriceB - sqrtPriceA);
  } else {
    // Price is within range, calculate both token amounts
    amount0 = liquidity.multipliedBy(sqrtPriceB - sqrtPrice).dividedBy(sqrtPrice * sqrtPriceB);
    amount1 = liquidity.multipliedBy(sqrtPrice - sqrtPriceA);
  }
  
  // Add any uncollected fees
  const amount0WithFees = amount0.plus(new BigNumber(position.tokensOwed0));
  const amount1WithFees = amount1.plus(new BigNumber(position.tokensOwed1));
  
  // Convert to actual token amounts considering decimals
  const actualAmount0 = amount0WithFees.dividedBy(new BigNumber(10).pow(token0Decimals));
  const actualAmount1 = amount1WithFees.dividedBy(new BigNumber(10).pow(token1Decimals));
  
  // Calculate USD value using token prices from constants
  const usdValue0 = actualAmount0.multipliedBy(token0Info.value).toNumber();
  const usdValue1 = actualAmount1.multipliedBy(token1Info.value).toNumber();


  console.log(`Token 0: ${token0Info.address}- USD Value: $${usdValue0}`);
  console.log(`Token 1: ${token1Info.address} - USD Value: $${usdValue1}`);
  
  // Total USD value of the position
  const totalUsdValue = usdValue0 + usdValue1;
  
  return totalUsdValue;
}

/**
 * Example usage:
 * 
 * const position = {
 *   nonce: "0",
 *   operator: "0x0000000000000000000000000000000000000000",
 *   token0: "0x836d275563bAb5E93Fd6Ca62a95dB7065Da94342", // USDC
 *   token1: "0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12", // WEDU
 *   tickLower: 284160,
 *   tickUpper: 286380,
 *   liquidity: "12807303456186",
 *   feeGrowthInside0LastX128: "484341968336904329625428629223",
 *   feeGrowthInside1LastX128: "1392435512005484397319951642594231504239016",
 *   tokensOwed0: "0",
 *   tokensOwed1: "0"
 * };
 * 
 * const usdValue = calculatePositionValue(position);
 * console.log(`Position USD value: $${usdValue.toFixed(2)}`);
 */

//  const position = {
//   nonce: "0",
//   operator: "0x0000000000000000000000000000000000000000",
//     token0: "0x7277Cc818e3F3FfBb169c6Da9CC77Fc2d2a34895",
//   token1: "0x836d275563bAb5E93Fd6Ca62a95dB7065Da94342",
//  tickLower: -520,
//   tickUpper: 481,
//  liquidity: "1974363",
//  feeGrowthInside0LastX128: "0",
//  feeGrowthInside1LastX128: "0",
//   tokensOwed0: "0",
//  tokensOwed1: "0"
//  };


