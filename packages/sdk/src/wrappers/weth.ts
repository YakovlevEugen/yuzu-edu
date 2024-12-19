import { wethAbi } from "abitype/abis";
import { Hex, getContract } from "viem";
import { IChainId } from "../chains";
import { getPublicClient } from "../clients";

export const getWETHContract = (chainId: IChainId, address: Hex) =>
	getContract({
		client: getPublicClient(chainId),
		address,
		abi: wethAbi,
	});

export const getWETHLogs = (params: {
	chainId: IChainId;
	address: Hex;
	fromBlock: bigint;
	toBlock: bigint;
}) => {
	const { chainId, fromBlock, toBlock, address } = params;
	return getPublicClient(chainId).getContractEvents({
		address,
		abi: wethAbi,
		fromBlock,
		toBlock,
		strict: true,
	});
};

// wrap / unwrap / get balance / get txs
