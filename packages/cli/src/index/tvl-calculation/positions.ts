import type { Pool } from '@uniswap/v3-sdk';
import type { Address } from 'viem';
import type { ICamelotNFTPosition } from './camelot';
import * as camelot from './camelot';
import { type ILP, chain } from './config';
import type { ISailfishNFTPosition } from './sailfish';
import * as sailfish from './sailfish';

export const getPosition = async (params: {
  wallet: Address;
  token: ILP;
  tokenId: string;
}) => {
  const nftPos = await getNFTPosition(params);
  const address = await getPoolAddress(nftPos);
  const pool = await getPool(nftPos, address);
  const value = await getPositionValue(nftPos, pool);

  return {
    wallet: params.wallet,
    token: address,
    symbol: `${params.token.name} ${pool.token0.symbol}/${pool.token1.symbol} (${params.tokenId})`,
    amount: nftPos.liquidity.toString(),
    value
  };
};

const getNFTPosition = (params: { token: ILP; tokenId: string }) => {
  switch (params.token.address) {
    case chain.contracts.sailfishPositionManager.address:
      return sailfish.getNFTPosition(params.tokenId);
    case chain.contracts.camelotPositionManager.address:
      return camelot.getNFTPosition(params.tokenId);
    default:
      throw new Error('unsupported lp');
  }
};

const getPoolAddress = (nftPos: INFTPosition) => {
  switch (nftPos.type) {
    case 'sailfish':
      return sailfish.getPoolAddress(nftPos);
    case 'camelot':
      return camelot.getPoolAddress(nftPos);
  }
};

const getPool = (nftPos: INFTPosition, address: Address) => {
  switch (nftPos.type) {
    case 'sailfish':
      return sailfish.getPool(nftPos, address);
    case 'camelot':
      return camelot.getPool(nftPos, address);
  }
};

const getPositionValue = (nftPos: INFTPosition, pool: Pool) => {
  switch (nftPos.type) {
    case 'sailfish':
      return sailfish.getPositionValue(nftPos, pool);
    case 'camelot':
      return camelot.getPositionValue(nftPos, pool);
  }
};

export type ILPPosition = {
  wallet: Address;
  token: Address;
  symbol: string;
  amount: string; // pool position liq
  value: string; // position value in usd
};

type INFTPosition = ISailfishNFTPosition | ICamelotNFTPosition;
