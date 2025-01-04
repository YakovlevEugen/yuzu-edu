import { SupabaseClient } from '@supabase/supabase-js';
import { Hono } from 'hono';
import type { IApp } from './types';

const app = new Hono<IApp>()
  .onError((err, c) => {
    console.error(err);
    return c.json({ error: err.message }, 500);
  })

  .use('/*', (c, next) => {
    c.set('db', new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_KEY));
    return next();
  })

  .get('/', (c) => c.json({ message: 'Welcome to Yuzu Indexer' }));

export default app;
