import { Hex, erc20Abi, getContract } from "viem";
import { IChainId } from "../chains";
import { getPublicClient } from "../clients";

export const getERC20Contract = (chainId: IChainId, address: Hex) =>
	getContract({
		client: getPublicClient(chainId),
		address,
		abi: erc20Abi,
	});

// get balance, transfer, approve allowance
