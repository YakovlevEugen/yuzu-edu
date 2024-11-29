import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { createClient } from "@yuzu/api";
import { Hex } from "viem";
import { useAccount } from "wagmi";

import { apiUrl } from "@/constants/config";

const client = createClient(apiUrl);

export const useBalance = () => {
	const { address } = useAccount();

	return useQuery({
		queryKey: ["balance", address],
		queryFn: () =>
			client.wallet[":address"].balance
				.$get({ param: { address: address as Hex } })
				.then((res) => res.json())
				.then((res) => res.balance),
		enabled: Boolean(address),
		initialData: "0",
	});
};

export const useStakeBalance = () => {
	const { address } = useAccount();

	return useQuery({
		queryKey: ["stake", address],
		queryFn: () =>
			client.wallet[":address"].stake
				.$get({ param: { address: address as Hex } })
				.then((res) => res.json())
				.then((res) => res.balance),
		enabled: Boolean(address),
		initialData: "0",
	});
};

export const useStakeEstimate = (value: string) => {
	const { address } = useAccount();

	return useQuery({
		queryKey: ["stake", "estimate", address, value],
		queryFn: () =>
			client.wallet[":address"].estimate
				.$get({
					param: { address: address as string },
					query: { value },
				})
				.then((res) => res.json())
				.then((res) => res.points),
		enabled: Boolean(address),
		initialData: "0",
	});
};

export const useBridgeHistory = () => {
	const { address } = useAccount();

	return useInfiniteQuery({
		queryKey: ["history", address],
		queryFn: ({ pageParam }) =>
			client.wallet[":address"].transfers
				.$get({
					param: { address: address as string },
					query: { page: pageParam.toString() },
				})
				.then((res) => res.json()),
		getNextPageParam: (pages) => pages.length,
		initialPageParam: 0,
		enabled: Boolean(address),
	});
};

export const usePointBalance = () => {
	const { address } = useAccount();

	return useQuery({
		queryKey: ["points", address],
		queryFn: () =>
			client.wallet[":address"].points
				.$get({
					param: { address: address as string },
				})
				.then((res) => res.json()),
		enabled: Boolean(address),
		initialData: 0,
	});
};
