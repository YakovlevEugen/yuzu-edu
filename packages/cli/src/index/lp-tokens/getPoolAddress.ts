import { camelotPairs, sailfishPairs } from '../../tvl-calculation/constant';

/**
 * Gets the pool address for a given token pair
 * @param token0 The address of token0
 * @param token1 The address of token1
 * @param isSailfish Whether to search in sailfishPairs (true) or camelotPairs (false)
 * @returns The pool address if found, or null if not found
 */
export function getPoolAddress(token0: string, token1: string, isSailfish: boolean): string | null {
  // Normalize token addresses to lowercase for comparison
  const normalizedToken0 = token0.toLowerCase();
  const normalizedToken1 = token1.toLowerCase();
  
  // Select the appropriate pairs object based on isSailfish flag
  const pairsToSearch = isSailfish ? sailfishPairs : camelotPairs;
  
  // Search for matching pair
  for (const [poolAddress, pair] of Object.entries(pairsToSearch)) {
    const pairToken0 = pair.token0.toLowerCase();
    const pairToken1 = pair.token1.toLowerCase();
    
    // Check if tokens match in either order
    if ((pairToken0 === normalizedToken0 && pairToken1 === normalizedToken1) || 
        (pairToken0 === normalizedToken1 && pairToken1 === normalizedToken0)) {
      return poolAddress;
    }
  }
  
  // No matching pool found
  return null;
}