import type { Workflow } from '@cloudflare/workers-types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@yuzu/supabase';
import type { Context } from 'hono';

export type IEnv = {
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  SCHEDULE: Workflow;
};

export type IApp = {
  Bindings: IEnv;
  Variables: {
    db: SupabaseClient<Database>;
    event?: ScheduledEvent;
  };
};

export type IContext = Context<IApp>;
