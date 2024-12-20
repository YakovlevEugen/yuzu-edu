import { zValidator } from "@hono/zod-validator";
import { SupabaseClient } from "@supabase/supabase-js";
import Big from "big.js";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Hex } from "viem";
import * as v from "zod";
import type { IEnv } from "./types";
import { getStakeBalance, getTokenBalance } from "./web3";
import { IChainId } from "@yuzu/sdk";

const app = new Hono<IEnv>()
	//
	.use(cors())

	.use((c, next) => {
		c.set("db", new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_KEY));
		c.set("mainnet", c.env.CONTRACTS_ENV === "mainnet");
		return next();
	})

	.get("/balance/:chainId/:address/:symbol", async (c) => {
		const balance = await getTokenBalance(c, {
			chainId: c.req.param("chainId") as IChainId,
			address: c.req.param("address") as Hex,
			symbol: c.req.param("symbol"),
		});

		return c.json({ balance });
	})

	.get("/wallet/:address/stake", async (c) => {
		const address = c.req.param("address") as Hex;
		const balance = await getStakeBalance(c, address);
		return c.json({ balance });
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
	)

	.post(
		'/verify-captcha',
		zValidator("query", v.object({ token: v.string() })),
		async (c) => {
			try {
				const { token } = c.req.valid("query");
				if (!token) {
					return c.json({ success: false, message: 'Token is required' }, 400);
				}

				const verificationResponse = await fetch(
					'https://challenges.cloudflare.com/turnstile/v0/siteverify',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							secret: c.env.TURNSTILE_SERVER_KEY,
							response: token,
						}),
					}
				);
				const result = await verificationResponse.json();

				if (result.success) {
					return c.json({ success: true, message: 'Verification successful' });
				} else {
					return c.json({
						success: false,
						message: 'Verification failed',
						errors: result['error-codes'] || [],
					}, 400);
				}
			} catch (error) {
				console.error('Error verifying Turnstile token:', error);
				return c.json({ success: false, message: 'Internal server error' }, 500);
			}
		}
	);

export default app;
