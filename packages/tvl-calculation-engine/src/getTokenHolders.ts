/**
 * TVL Calculation Engine
 */

import { getTokenHolders, whitelistedTokens } from './constants';

export const calculateTVL = async () => {
  const holders = await getTokenHolders(whitelistedTokens[0]);
  console.log(holders);
};

calculateTVL();
