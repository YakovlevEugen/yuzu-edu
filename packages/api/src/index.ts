import { zValidator } from "@hono/zod-validator";
import { SupabaseClient } from "@supabase/supabase-js";
import Big from "big.js";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Hex } from "viem";
import * as v from "zod";
import type { IEnv } from "./types";
import { getBalance, getStakeBalance } from "./web3";

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

		const points = await c.var.db
			.from("wedu_agg_point_balances_view")
			.select("*")
			.eq("address", address)
			.maybeSingle()
			.then((res) => parseFloat(res.data?.points?.toFixed(6) || "0"));

		return c.json(points);
	})

	.get(
		"/wallet/:address/estimate",
		zValidator("query", v.object({ value: v.string() })),
		async (c) => {
			const { address } = c.req.param();
			const { value } = c.req.valid("query");

			const points = await c.var.db
				.from("wedu_agg_point_balances_view")
				.select("*")
				.eq("address", address)
				.maybeSingle()
				.then((res) => parseFloat(res.data?.points?.toFixed(6) || "0"));

			const output = new Big(value).div(1e18).mul(24).add(points).toString();
			console.log({ points, value, output });
			return c.json({ points: output });
		},
	);

export default app;
export * from "./client";
export * from "./types";
