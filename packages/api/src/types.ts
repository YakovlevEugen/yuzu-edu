import type { SupabaseClient } from '@supabase/supabase-js';
import type { IChainId } from '@yuzu/sdk';
import type { Database, Tables } from '@yuzu/supabase';
import type { Context } from 'hono';
import type { Hex } from 'viem';

export type IEnv = {
  Bindings: {
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
    TESTNET_SIGNER_PK: Hex;
    MAINNET_SIGNER_PK: Hex;
    TURNSTILE_KEY: string;
    CONTRACTS_ENV: IChainId;
  };
  Variables: {
    db: SupabaseClient<Database>;
  };
};

export type IContext = Context<IEnv>;
export type IEligibility = 'eligible' | 'not-eligible' | 'claimed';
export type IRewardHistoryItem = Tables<'community_rewards_history'>;
