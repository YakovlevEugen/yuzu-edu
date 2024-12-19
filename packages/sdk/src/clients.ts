import {
	Account,
	createPublicClient,
	createWalletClient,
	Hex,
	http,
} from "viem";
import { getChain, IChainId } from "./chains";

export const getPublicClient = (chainId: IChainId) =>
	createPublicClient({
		chain: getChain(chainId),
		transport: http(undefined, {
			retryCount: 100,
			retryDelay: 10000,
		}),
	});

export const getWalletClient = (chainId: IChainId, account: Hex | Account) =>
	createWalletClient({
		chain: getChain(chainId),
		transport: http(),
		account,
	});
