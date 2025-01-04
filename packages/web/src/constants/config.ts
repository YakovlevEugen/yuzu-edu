import type { IChainId } from '@yuzu/sdk';

export const apiUrl = import.meta.env.VITE_API_URL as string;

export const chainId: IChainId =
  import.meta.env.VITE_CONTRACTS_ENV === 'mainnet'
    ? 'eduMainnet'
    : 'eduTestnet';
