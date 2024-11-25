import { Hono } from "hono";
import { getBalance, getBlock, getStakeBalance } from "./web3";
import { Hex } from "viem";
import type { IEnv, IPointsType } from "./types";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import * as v from "zod";
import { SupabaseClient } from "@supabase/supabase-js";
import Big from "big.js";
import { estimate } from "./points";

const app = new Hono<IEnv>()
	//
	.use(cors())

	.use((c, next) => {
		c.set("db", new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_KEY));
		return next();
	})

	.get("/wallet/:address/balance", async (c) => {
		const balance = await getBalance(c, c.req.param("address") as Hex);
		return c.json({ balance: balance.toString() });
	})

	.get("/wallet/:address/stake", async (c) => {
		const balance = await getStakeBalance(c, c.req.param("address") as Hex);
		return c.json({ balance: balance.toString() });
	})

	.get(
		"/wallet/:address/transfers",
		zValidator("query", v.object({ page: v.string() })),
		async (c) => {
			return c.json([
				{
					timestamp: new Date().toISOString(),
					amount: "1000000000000000000000",
					points: "1000",
				},
			]);
		},
	)

	.get("/wallet/:address/points", async (c) => {
		const { address } = c.req.param();

		const transactions = await c.var.db
			.from("transactions")
			.select("*")
			.eq("address", address)
			.order("createdAt", { ascending: false })
			.then((res) => res.data || []);

		const block = await getBlock(c);

		const points = transactions
			.map((t) =>
				estimate({
					fromBlock: t.block,
					toBlock: block,
					value: t.value,
					type: t.type as IPointsType,
				}),
			)
			.reduce((m, a) => m + a, 0);

		return c.json(points);
	})

	.get(
		"/wallet/:address/estimate",
		zValidator("query", v.object({ value: v.string() })),
		async (c) => {
			const { value } = c.req.valid("query");

			const block = await getBlock(c);

			const points = estimate({
				fromBlock: block,
				toBlock: block + 600000,
				value: parseInt(value),
				type: "stake",
			});

			return c.json({ points });
		},
	);

export default app;
export * from "./client";
export * from "./types";
