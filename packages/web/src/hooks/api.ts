import { apiUrl } from '@/constants/config';
import type { IToken } from '@/constants/currencies';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { createClient } from '@yuzu/api';
import type { IChainId } from '@yuzu/sdk';
import { type ITxRequest, decodeTxRequest } from '@yuzu/sdk/src/requests';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import { useReferral } from './use-referral';

const client = createClient(apiUrl);

/**
 * Common
 */

export const useTokenBalance = (chainId: IChainId, symbol: string) => {
  const account = useAccount();
  const address = account.address as Hex;

  return useQuery({
    queryKey: ['balance', chainId, address, symbol],
    queryFn: () =>
      client.balance[':chainId'][':address'][':symbol']
        .$get({ param: { chainId, address, symbol } })
        .then((res) => res.json()),
    enabled: Boolean(address),
    initialData: '0',
    refetchInterval: 30_000
  });
};

/**
 * Staking
 */

export const useStakingPoints = () => {
  const account = useAccount();
  const address = account.address as Hex;

  return useQuery({
    queryKey: ['staking', address, 'points'],
    queryFn: () =>
      client.staking[':address'].points
        .$get({ param: { address } })
        .then((res) => res.json()),
    enabled: Boolean(address),
    initialData: 0
  });
};

export const useStakingEstimate = (value: string) => {
  const account = useAccount();
  const address = account.address as Hex;

  return useQuery({
    queryKey: ['staking', address, 'estimate', value],
    queryFn: () =>
      client.staking[':address'].estimate
        .$get({
          param: { address },
          query: { value }
        })
        .then((res) => res.json()),
    enabled: Boolean(address),
    initialData: 0
  });
};

export const useStakingHistory = () => {
  const account = useAccount();
  const address = account.address as Hex;

  return useInfiniteQuery({
    queryKey: ['staking', address, 'history'],
    queryFn: ({ pageParam }) =>
      client.staking[':address'].history
        .$get({
          param: { address },
          query: { page: pageParam.toString() }
        })
        .then((res) => res.json()),
    getNextPageParam: (pages) => pages.length,
    initialPageParam: 0,
    enabled: Boolean(address)
  });
};

export const useCreateStakeTx = () => {
  const account = useAccount();
  const address = account.address as Hex;

  return useMutation<ITxRequest, unknown, { amount: string }>({
    mutationKey: ['staking', address, 'wrap'],
    mutationFn: async ({ amount }) =>
      client.staking[':address'].wrap
        .$get({
          param: { address },
          query: { amount }
        })
        .then((res) => res.json())
        .then(decodeTxRequest)
  });
};

export const useCreateUnstakeTx = () => {
  const account = useAccount();
  const address = account.address as Hex;

  return useMutation<ITxRequest, unknown, { amount: string }>({
    mutationKey: ['staking', address, 'unwrap'],
    mutationFn: async ({ amount }) =>
      client.staking[':address'].unwrap
        .$get({
          param: { address },
          query: { amount }
        })
        .then((res) => res.json())
        .then(decodeTxRequest)
  });
};

/**
 * Bridging
 */

export const useBridgeHistory = () => {
  const account = useAccount();
  const address = account.address as Hex;

  return useInfiniteQuery({
    queryKey: ['bridge', address, 'history'],
    queryFn: ({ pageParam }) =>
      client.bridge[':address'].history
        .$get({
          param: { address },
          query: { page: pageParam.toString() }
        })
        .then((res) => res.json()),
    getNextPageParam: (pages) => pages.length,
    initialPageParam: 0,
    enabled: Boolean(address)
  });
};

export const useBridgeApproveTx = () => {
  const account = useAccount();
  const address = account.address as Hex;

  return useMutation<ITxRequest, unknown, { symbol: IToken; amount: string }>({
    mutationKey: ['bridge', address, 'approve'],
    mutationFn: async (params) =>
      client.bridge[':address'].approve[':symbol'][':amount']
        .$get({ param: { address, ...params } })
        .then((res) => res.json())
        .then(decodeTxRequest)
  });
};

export const useBridgeDepositTx = () => {
  const account = useAccount();
  const address = account.address as Hex;
  const ref = useReferral();

  return useMutation<ITxRequest, unknown, { symbol: IToken; amount: string }>({
    mutationKey: ['bridge', address, 'deposit'],
    mutationFn: async (params) =>
      client.bridge[':address'].deposit[':symbol'][':amount']
        .$get({
          param: { address, ...params },
          query: { ref }
        })
        .then((res) => res.json())
        .then(decodeTxRequest)
  });
};

export const useBridgeWithdrawTx = () => {
  const account = useAccount();
  const address = account.address as Hex;

  return useMutation<ITxRequest, unknown, { symbol: IToken; amount: string }>({
    mutationKey: ['bridge', address, 'withdraw'],
    mutationFn: async (params) =>
      client.bridge[':address'].withdraw[':symbol'][':amount']
        .$get({ param: { address, ...params } })
        .then((res) => res.json())
        .then(decodeTxRequest)
  });
};

// export const usePointBalance = () => {
//   const { address } = useAccount();

//   return useQuery({
//     queryKey: ['points', address],
//     queryFn: () =>
//       client.wallet[':address'].points
//         .$get({
//           param: { address: address as string }
//         })
//         .then((res) => res.json()),
//     enabled: Boolean(address),
//     initialData: 0
//   });
// };
