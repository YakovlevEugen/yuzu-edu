import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@yuzu/supabase';
import type { Context } from 'hono';

export type IEnv = {
  Bindings: {
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
    CONTRACTS_ENV: IContractsEnv;
    DOMAIN: string;
  };
  Variables: {
    db: SupabaseClient<Database>;
    mainnet: boolean;
  };
};

export type IContractsEnv = 'mainnet' | 'testnet';
export type IContext = Context<IEnv>;
export type IPointsType = 'stake' | 'bridge';
export type IEligibility = 'eligible' | 'not-eligible' | 'claimed';
