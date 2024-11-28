import { createPublicClient, defineChain, getContract, http } from "viem";
import { abi } from "./abi/wedu";

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

export type IChain = typeof eduMainnet;
export type IChainName = IChain["name"];
export const chains = { eduMainnet } as const;

export const getPublicClient = (chain: IChain) =>
	createPublicClient({
		chain,
		transport: http(),
	});

export const wedu = (chain: IChain) =>
	getContract({
		client: getPublicClient(chain),
		address: chain.contracts.wedu.address,
		abi,
	});

export const getWEDULogs = (params: {
	fromBlock: bigint;
	toBlock: bigint;
	chain: IChain;
}) => {
	const { chain, fromBlock, toBlock } = params;
	const { address, abi } = wedu(chain);
	const client = getPublicClient(chain);

	return client.getContractEvents({
		address,
		abi,
		fromBlock,
		toBlock,
		strict: true,
	});
};
