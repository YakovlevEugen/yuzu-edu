import type { WorkflowEvent } from 'cloudflare:workers';
import type { Workflow } from '@cloudflare/workers-types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@yuzu/supabase';
import type { Context } from 'hono';

export type IEnv = {
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  EDUCHAIN_RPC_URL: string;
  SCHEDULE: Workflow;
  PARALLEL: Workflow;
  MERKLE_CLAIM: Workflow;
};

export type IApp = {
  Bindings: IEnv;
  Variables: {
    db: SupabaseClient<Database>;
    event?: WorkflowEvent<IPWPayload>;
  };
};

export type IPWPayload = { shardId: number };
export type IContext = Context<IApp>;
