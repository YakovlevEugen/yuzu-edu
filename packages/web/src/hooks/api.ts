import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { createClient } from '@yuzu/api';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';

import { apiUrl } from '@/constants/config';
import type { IChainId } from '@yuzu/sdk';
import { type ITxRequest, decodeTxRequest } from '@yuzu/sdk/src/requests';

const client = createClient(apiUrl);

/**
 * Common
 */

export const useTokenBalance = (chainId: IChainId, symbol: string) => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ['balance', chainId, address, symbol],
    queryFn: () =>
      client.balance[':chainId'][':address'][':symbol']
        .$get({
          param: {
            chainId,
            address: address as string,
            symbol
          }
        })
        .then((res) => res.json()),
    enabled: Boolean(address),
    initialData: '0'
  });
};

/**
 * Staking
 */

export const useStakingPoints = () => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ['staking', address, 'points'],
    queryFn: () =>
      client.staking[':address'].points
        .$get({ param: { address: address as Hex } })
        .then((res) => res.json()),
    enabled: Boolean(address),
    initialData: 0
  });
};

export const useStakingEstimate = (value: string) => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ['staking', address, 'estimate', value],
    queryFn: () =>
      client.staking[':address'].estimate
        .$get({
          param: { address: address as string },
          query: { value }
        })
        .then((res) => res.json()),
    enabled: Boolean(address),
    initialData: 0
  });
};

export const useStakingHistory = () => {
  const { address } = useAccount();

  return useInfiniteQuery({
    queryKey: ['staking', address, 'history'],
    queryFn: ({ pageParam }) =>
      client.staking[':address'].history
        .$get({
          param: { address: address as string },
          query: { page: pageParam.toString() }
        })
        .then((res) => res.json()),
    getNextPageParam: (pages) => pages.length,
    initialPageParam: 0,
    enabled: Boolean(address)
  });
};

export const useCreateStakeTx = () => {
  const { address } = useAccount();

  return useMutation<ITxRequest, unknown, { amount: string }>({
    mutationKey: ['staking', address, 'wrap'],
    mutationFn: async ({ amount }) =>
      client.staking[':address'].wrap
        .$get({
          query: { amount },
          param: { address: address as Hex }
        })
        .then((res) => res.json())
        .then(decodeTxRequest)
  });
};

export const useCreateUnstakeTx = () => {
  const { address } = useAccount();

  return useMutation<ITxRequest, unknown, { amount: string }>({
    mutationKey: ['staking', address, 'unwrap'],
    mutationFn: async ({ amount }) =>
      client.staking[':address'].unwrap
        .$get({
          query: { amount },
          param: { address: address as Hex }
        })
        .then((res) => res.json())
        .then(decodeTxRequest)
  });
};

/**
 * Bridging
 */

export const useBridgeHistory = () => {
  const { address } = useAccount();

  return useInfiniteQuery({
    queryKey: ['bridge', address, 'history'],
    queryFn: ({ pageParam }) =>
      client.bridge[':address'].history
        .$get({
          param: { address: address as string },
          query: { page: pageParam.toString() }
        })
        .then((res) => res.json()),
    getNextPageParam: (pages) => pages.length,
    initialPageParam: 0,
    enabled: Boolean(address)
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
