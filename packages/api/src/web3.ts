import { defineChain, getContract, Hex } from "viem";
import { IContext } from "./types";
import { abi } from "./abi/wedu";

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

const wedu = getContract({
	client: publicClient,
	address: "0x345E902846aC3805719483d80D664ABa0B6aF40C",
	abi,
});

export const getBalance = async (c: IContext, address: Hex) => {
	const balance = await publicClient.getBalance({ address });
	return balance;
};

export const getStakeBalance = async (c: IContext, address: Hex) => {
	const balance = await wedu.read.balanceOf([address]);
	return balance;
};

export const getBlock = async (c: IContext) => {
	const blockNumber = await publicClient.getBlockNumber();
	return Number(blockNumber);
};
