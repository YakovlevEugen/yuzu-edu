import { useQuery } from "@tanstack/react-query";
import { createClient } from "@yuzu/api";
import { Hex } from "viem";

const client = createClient("http://localhost:5172");

export const useBalance = (address: Hex | undefined) =>
	useQuery({
		queryKey: ["balance", address],
		queryFn: () =>
			client.wallet[":address"].balance
				.$get({ param: { address: address as Hex } })
				.then((res) => res.json())
				.then((res) => res.balance),
		enabled: Boolean(address),
		initialData: "--",
	});
