import { hc } from 'hono/client';
import type IApp from './server';

export const createClient = (baseUrl: string) => hc<typeof IApp>(baseUrl);
