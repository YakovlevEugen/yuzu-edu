import type { IContractsEnv } from '@/hooks/use-environment';

export const apiUrl = import.meta.env.VITE_API_URL as string;
export const contractsEnv = import.meta.env.VITE_CONTRACTS_ENV as IContractsEnv;
export const sitekey = import.meta.env.VITE_TURSTILE_SITEKEY as string;

export const postHogKey = import.meta.env.VITE_APP_PUBLIC_POSTHOG_KEY as string;
export const postHogHost = import.meta.env
  .VITE_APP_PUBLIC_POSTHOG_HOST as string;
