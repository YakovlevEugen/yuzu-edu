import Big from 'big.js';
import type { Address } from 'viem';
import { whitelistedTokens } from './config';
import type { IHolderData } from './helpers';

export const getTokenHoldersReport = (holderData: IHolderData[]) => {
  const tokenColumns = whitelistedTokens.flatMap((token) => [
    `${token.symbol}_amount`,
    `${token.symbol}_value`
  ]);

  const header = ['wallet', ...tokenColumns, 'total_usd_value'].join(',');

  const holders = new Map<Address, IHolderData[]>([]);
  holderData.forEach((row) =>
    holders.set(row.wallet, [...(holders.get(row.wallet) || []), row])
  );

  const rows = Array.from(holders.entries()).map(([wallet, holdings]) =>
    [
      wallet,
      ...whitelistedTokens
        .map((token) => holdings.find((h) => h.token === token.address))
        .flatMap((pos) => [pos?.amount ?? '0', pos?.value ?? 0]),
      holdings
        .reduce((m, { value }) => m.add(value), new Big(0))
        .toFixed(undefined, 0)
    ].join(',')
  );

  return [header].concat(rows);
};
