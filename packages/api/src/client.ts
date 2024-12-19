import { hc } from "hono/client";
import type app from "./server";

export const createClient = (baseUrl: string) => hc<typeof app>(baseUrl);
