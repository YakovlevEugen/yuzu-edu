import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@yuzu/supabase';
import { createMiddleware } from 'hono/factory';
import type { IEnv } from './types';

export const database = () =>
  createMiddleware<IEnv>((c, next) => {
    const db = new SupabaseClient<Database>(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_KEY
    );
    c.set('db', db);
    return next();
  });

export const network = () =>
  createMiddleware<IEnv>((c, next) => {
    c.set('mainnet', c.env.CONTRACTS_ENV === 'mainnet');
    return next();
  });
