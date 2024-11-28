import { SupabaseClient } from "@supabase/supabase-js";
import type { IContext, IEnv } from "./types";
import type { Json } from "@yuzu/supabase";
import type { Hex, Log } from "viem";
import { IChain } from "./web3";

(BigInt.prototype as unknown as Record<string, unknown>).toJSON = function () {
	return this.toString();
};

export const createContext = (
	event: ScheduledEvent,
	env: IEnv,
	executionCtx: ExecutionContext,
): IContext =>
	({
		env,
		var: {
			db: new SupabaseClient(env.SUPABASE_URL, env.SUPABASE_KEY),
			event,
		},
		executionCtx,
	}) as IContext;

export const getConfigValue = <T>(
	c: IContext,
	params: { key: string; scope: string },
) =>
	c.var.db
		.from("configs")
		.select("*")
		.eq("key", params.key)
		.eq("scope", params.scope)
		.maybeSingle()
		.then((res) => {
			if (res.error) throw new Error(res.error.message);
			return res.data?.value as T;
		});

export const setConfigValue = <T extends Json | undefined>(
	c: IContext,
	params: { key: string; scope: string; value: T },
) =>
	c.var.db
		.from("configs")
		.upsert(params, { onConflict: "key,scope", ignoreDuplicates: false })
		.then((res) => {
			if (res.error) throw new Error(res.error.message);
			return res.data;
		});

export const getLastIndexedBlock = (c: IContext, scope: string) =>
	getConfigValue<number>(c, { key: "lastIndexedBlock", scope }).then(
		(v) => v || 0,
	);

export const setLastIndexedBlock = (
	c: IContext,
	scope: string,
	value: bigint,
) =>
	setConfigValue(c, { key: "lastIndexedBlock", scope, value: Number(value) });

export const toChunks = (params: {
	from: number | bigint;
	to: number | bigint;
	chunkSize: number;
}) => {
	const out: { fromBlock: bigint; toBlock: bigint }[] = [];
	const from = Number(params.from);
	const to = Number(params.to);
	const size = params.chunkSize;

	for (let i = from; i < to; i += size) {
		out.push({
			fromBlock: BigInt(i),
			toBlock: BigInt(Math.min(i + size, to)),
		});
	}

	return out;
};

// export const upsertCampaign = (
// 	c: IContext,
// 	chain: IChain,
// 	params: {
// 		campaignId: bigint;
// 		campaign: {
// 			creatorPool: bigint;
// 			engagerPool: bigint;
// 			treasury: Hex;
// 			startsAt: bigint;
// 			token: Hex;
// 			endsAt: bigint;
// 		};
// 	},
// ) =>
// 	c.var.db
// 		.from("campaigns")
// 		.upsert(
// 			{
// 				id: Number(params.campaignId),
// 				chain: chain.name,
// 				creatorPool: params.campaign.creatorPool.toString(),
// 				engagerPool: params.campaign.engagerPool.toString(),
// 				treasury: params.campaign.treasury,
// 				token: params.campaign.token,
// 				startsAt: new Date(
// 					parseInt(params.campaign.startsAt.toString()) * 1000,
// 				).toISOString(),
// 				endsAt: new Date(
// 					parseInt(params.campaign.endsAt.toString()) * 1000,
// 				).toISOString(),
// 				details: {},
// 			},
// 			{
// 				onConflict: "id, chain",
// 				ignoreDuplicates: false,
// 			},
// 		)
// 		.then((res) => {
// 			if (res.error) throw new Error(res.error.message);
// 		});

// export const incCampaignBalance = (
// 	c: IContext,
// 	chain: IChain,
// 	params: {
// 		campaignId: bigint;
// 		recipient: Hex;
// 		amount: bigint;
// 		role: number;
// 	},
// ) =>
// 	c.var.db
// 		.rpc("incrementcampaignbalance", {
// 			chain: chain.name,
// 			campaign_id: Number(params.campaignId),
// 			recipient: params.recipient,
// 			creator_amount: params.role === 0 ? Number(params.amount) : 0,
// 			engager_amount: params.role === 1 ? Number(params.amount) : 0,
// 		})
// 		.then((res) => {
// 			if (res.error) throw new Error(res.error.message);
// 		});

// export const claimCampaignBalance = (
// 	c: IContext,
// 	chain: IChain,
// 	params: {
// 		campaignId: bigint;
// 		recipient: Hex;
// 		wallet: Hex;
// 	},
// ) =>
// 	c.var.db
// 		.from("campaign_balances")
// 		.update({ claimedBy: params.wallet })
// 		.eq("recipient", params.recipient)
// 		.eq("chain", chain.name)
// 		.eq("campaignId", Number(params.campaignId))
// 		.then((res) => {
// 			if (res.error) throw new Error(res.error.message);
// 		});

// export const upsertWEDUTx = (c: IContext, chain: IChain, log: Log) =>
// 	c.var.db.from("wedu_txs").upsert(
// 		{
// 			...({ chain: chain.name } as { chain: string }),
// 			txHash: log.transactionHash,
// 			txIndex: log.transactionIndex,
// 			logIndex: log.logIndex,
// 			address: log.address,
// 			blockNumber: log.blockNumber,
// 			data: log,
// 		},
// 		{
// 			onConflict: "chain,txHash,txIndex,logIndex",
// 			ignoreDuplicates: false,
// 		},
// 	);

export const upsertWEDUBalance = (
	c: IContext,
	params: {
		chain: IChain;
		log: Log;
		address: Hex;
		amount: bigint;
		timestamp: string;
	},
) =>
	c.var.db
		.from("wedu_balance_changes")
		.upsert(
			{
				// @ts-ignore
				chain: params.chain.name,
				transactionHash: params.log.transactionHash,
				transactionIndex: params.log.transactionIndex,
				logIndex: params.log.logIndex,
				address: params.address,
				amount: params.amount.toString(),
				blockNumber: params.log.blockNumber,
				blockTimestamp: params.timestamp,
			},
			{
				onConflict: "chain,transactionHash,transactionIndex,logIndex,address",
				ignoreDuplicates: false,
			},
		)
		.then((res) => {
			if (res.error) throw new Error(res.error.message);
		});
