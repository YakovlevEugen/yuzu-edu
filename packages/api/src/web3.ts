import { defineChain, Hex } from "viem";
import { IContext } from "./types";

export const eduTestnet = defineChain({
	id: 656476,
	name: "Open Campus Codex",
	nativeCurrency: {
		decimals: 18,
		name: "EDU",
		symbol: "EDU",
	},
	rpcUrls: {
		default: {
			http: ["https://rpc.open-campus-codex.gelato.digital"],
			webSocket: ["wss://ws.open-campus-codex.gelato.digital"],
		},
	},
	blockExplorers: {
		default: {
			name: "Explorer",
			url: "https://edu-chain-testnet.blockscout.com/",
		},
	},
});

import { http, createPublicClient } from "viem";

export const publicClient = createPublicClient({
	chain: eduTestnet,
	transport: http(eduTestnet.rpcUrls.default.http.at(0)),
});

export type IChain = typeof eduTestnet;
export type IChainName = "eduTestnet";

export const chains = { eduTestnet } as const;

export const getBalance = async (c: IContext, address: Hex) => {
	const balance = await publicClient.getBalance({ address });
	return balance;
};
