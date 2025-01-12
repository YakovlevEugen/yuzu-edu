import type { IContractsEnv } from '@yuzu/api';

export const apiUrl: string = import.meta.env.VITE_API_URL;
export const contractsEnv: IContractsEnv = import.meta.env.VITE_CONTRACTS_ENV;
export const sitekey = import.meta.env.VITE_TURSTILE_SITEKEY;
