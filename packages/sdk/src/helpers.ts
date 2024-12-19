import { IChainId, eduMainnet, eduTestnet } from "./chains";

export const getWEDUAddress = (chainId: IChainId) => {
	switch (chainId) {
		case "eduMainnet":
			return eduMainnet.contracts.wedu.address;
		case "eduTestnet":
			return eduTestnet.contracts.wedu.address;
		default:
			throw new Error("unsupported chain");
	}
};
