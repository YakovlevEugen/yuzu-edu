import {
	IChainId,
	getChain,
	getERC20Contract,
	getPublicClient,
	getTokenAddress,
	getWEDUAddress,
	getWETHContract,
} from "@yuzu/sdk";
import Big from "big.js";
import { Hex } from "viem";
import { assert } from "./helpers";
import { IContext } from "./types";

export const getTokenBalance = async (
	c: IContext,
	params: {
		chainId: IChainId;
		address: Hex;
		symbol: string;
	},
) => {
	const { chainId, address, symbol } = params;
	const { nativeCurrency } = getChain(chainId);
	const isNativeCurrency = nativeCurrency.symbol.toLowerCase() === symbol;

	if (isNativeCurrency) {
		const client = getPublicClient(params.chainId);
		const balance = await client.getBalance({ address });
		return new Big(balance.toString()).div(1e18).toFixed();
	}

	const tokenAddress = getTokenAddress(chainId, symbol);
	assert(tokenAddress, "token symbol not found");
	const contract = getERC20Contract(chainId, tokenAddress);

	const [balance, decimals] = await Promise.all([
		contract.read.balanceOf([address]),
		contract.read.decimals(),
	]);

	return new Big(balance.toString()).div(10 ** decimals).toFixed();
};

export const getStakeBalance = async (c: IContext, address: Hex) => {
	const chainId = c.var.mainnet ? "eduMainnet" : "eduTestnet";
	const wedu = getWEDUAddress(chainId);
	const contract = getWETHContract(chainId, wedu);
	const balance = await contract.read.balanceOf([address]);
	return new Big(balance.toString()).div(1e18).toFixed(18);
};

export const getBlock = async (c: IContext) => {
	const chainId = c.var.mainnet ? "eduMainnet" : "eduTestnet";
	return getPublicClient(chainId).getBlockNumber().then(Number);
};
