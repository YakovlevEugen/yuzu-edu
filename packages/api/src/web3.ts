import { getPublicClient, getWEDUAddress, getWETHContract } from "@yuzu/sdk";
import { Hex } from "viem";
import { IContext } from "./types";

export const getBalance = async (c: IContext, address: Hex) => {
	const chainId = c.var.mainnet ? "eduMainnet" : "eduTestnet";
	const client = getPublicClient(chainId);
	return client.getBalance({ address });
};

export const getStakeBalance = async (c: IContext, address: Hex) => {
	const chainId = c.var.mainnet ? "eduMainnet" : "eduTestnet";
	const wedu = getWEDUAddress(chainId);
	const contract = getWETHContract(chainId, wedu);
	return contract.read.balanceOf([address]);
};

export const getBlock = async (c: IContext) => {
	const chainId = c.var.mainnet ? "eduMainnet" : "eduTestnet";
	const client = getPublicClient(chainId);
	return client.getBlockNumber().then(Number);
};
