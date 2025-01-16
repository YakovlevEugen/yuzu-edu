/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_CONTRACTS_ENV?: string;
  readonly VITE_TURSTILE_SITEKEY?: string;
  readonly VITE_APP_PUBLIC_POSTHOG_KEY?: string;
  readonly VITE_APP_PUBLIC_POSTHOG_HOST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
