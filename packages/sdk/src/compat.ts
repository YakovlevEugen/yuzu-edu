import { providers } from "ethers";
import { Account, Chain, Client, Transport } from "viem";

export function clientToProvider(client: Client<Transport, Chain>) {
	const { chain, transport } = client;

	const network = {
		chainId: chain.id,
		name: chain.name,
		ensAddress: chain.contracts?.ensRegistry?.address,
	};

	if (transport.type === "fallback")
		return new providers.FallbackProvider(
			(transport.transports as ReturnType<Transport>[]).map(
				({ value }) => new providers.JsonRpcProvider(value?.url, network),
			),
		);

	return new providers.JsonRpcProvider(transport.url, network);
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
	const { account, chain, transport } = client;

	const network = {
		chainId: chain.id,
		name: chain.name,
		ensAddress: chain.contracts?.ensRegistry?.address,
	};

	const provider = new providers.Web3Provider(transport, network);
	const signer = provider.getSigner(account.address);

	return signer;
}
