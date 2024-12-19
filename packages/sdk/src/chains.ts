import { defineChain } from "viem";
import { arbitrumSepolia, arbitrum } from "viem/chains";

export const eduTestnet = defineChain({
	id: 656476,
	name: "EDU Testnet",
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
	contracts: {
		wedu: { address: "0x345E902846aC3805719483d80D664ABa0B6aF40C" },
	},
});

export const eduMainnet = defineChain({
	id: 41923,
	name: "EDU Mainnet",
	nativeCurrency: {
		decimals: 18,
		name: "EDU",
		symbol: "EDU",
	},
	rpcUrls: {
		default: {
			http: ["https://rpc.edu-chain.raas.gelato.cloud"],
			webSocket: ["wss://ws.edu-chain.raas.gelato.cloud"],
		},
	},
	blockExplorers: {
		default: {
			name: "Explorer",
			url: "https://educhain.blockscout.com/",
		},
	},
	contracts: {
		wedu: { address: "0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12" },
	},
});

export const arbTestnet = defineChain({
	...arbitrumSepolia,
	contracts: {
		weth: { address: "0x2A1b409Cd444Be8F4388c50997e0Ff87e9e718Ad" },
	},
});

export const arbMainnet = defineChain({
	...arbitrum,
	contracts: {
		weth: { address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" },
	},
});

export type IChain =
	| typeof eduMainnet
	| typeof eduTestnet
	| typeof arbMainnet
	| typeof arbTestnet;

export type IChainName = IChain["name"];

export const chains = {
	eduMainnet,
	eduTestnet,
	arbMainnet,
	arbTestnet,
} as const;

export type IChainId = keyof typeof chains;

export const toChainId = (chain: IChain) => {
	switch (chain) {
		case eduMainnet:
			return "eduMainnet";
		case eduTestnet:
			return "eduTestnet";
		case arbMainnet:
			return "arbMainnet";
		case arbTestnet:
			return "arbTestnet";
		default:
			throw new Error("unsupported chain");
	}
};

export const getChain = (chainId: IChainId) => chains[chainId];
