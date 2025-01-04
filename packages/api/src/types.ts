import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@yuzu/supabase';
import type { Context } from 'hono';

export type IEnv = {
  Bindings: {
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
    CONTRACTS_ENV: 'mainnet' | 'testnet';
    DOMAIN: string;
  };
  Variables: {
    db: SupabaseClient<Database>;
    mainnet: boolean;
  };
};

export type IContext = Context<IEnv>;
export type IPointsType = 'stake' | 'bridge';
export type IEligibility = 'eligible' | 'not-eligible' | 'claimed';
