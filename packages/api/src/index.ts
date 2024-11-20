import { Hono } from "hono";
import { getBalance } from "./web3";
import { Hex } from "viem";
import type { IEnv } from "./types";
import { cors } from "hono/cors";

const app = new Hono<IEnv>()
	//
	.use(cors())

	.get("/wallet/:address/balance", async (c) => {
		const balance = await getBalance(c, c.req.param("address") as Hex);
		return c.json({ balance: balance.toString() });
	});

export default app;
export * from "./client";
export * from "./types";
