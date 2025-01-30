import { apiUrl } from '@/constants/config';
import type { IToken } from '@/constants/currencies';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { createClient } from '@yuzu/api';
import type { IChainId } from '@yuzu/sdk';
import { type ITxRequest, decodeTxRequest } from '@yuzu/sdk/src/requests';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import { useChainId, useParentChainId } from './use-chain-id';
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
  const chainId = useChainId();

  return useQuery({
    queryKey: ['staking', chainId, address, 'points'],
    queryFn: () =>
      client.staking[':chainId'][':address'].points
        .$get({ param: { chainId, address } })
        .then((res) => res.json()),
    enabled: Boolean(address),
    initialData: 0
  });
};

export const useStakingEstimate = (value: string) => {
  const account = useAccount();
  const address = account.address as Hex;
  const chainId = useChainId();

  return useQuery({
    queryKey: ['staking', chainId, address, 'estimate', value],
    queryFn: () =>
      client.staking[':chainId'][':address'].estimate
        .$get({
          param: { chainId, address },
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
  const chainId = useChainId();

  return useInfiniteQuery({
    queryKey: ['staking', address, 'history'],
    queryFn: ({ pageParam }) =>
      client.staking[':chainId'][':address'].history
        .$get({
          param: { chainId, address },
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
  const chainId = useChainId();

  return useMutation<ITxRequest, unknown, { amount: string }>({
    mutationKey: ['staking', chainId, address, 'wrap'],
    mutationFn: async ({ amount }) =>
      client.staking[':chainId'][':address'].wrap
        .$get({
          param: { chainId, address },
          query: { amount }
        })
        .then((res) => res.json())
        .then(decodeTxRequest)
  });
};

export const useCreateUnstakeTx = () => {
  const account = useAccount();
  const address = account.address as Hex;
  const chainId = useChainId();

  return useMutation<ITxRequest, unknown, { amount: string }>({
    mutationKey: ['staking', chainId, address, 'unwrap'],
    mutationFn: async ({ amount }) =>
      client.staking[':chainId'][':address'].unwrap
        .$get({
          param: { chainId, address },
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
  const chainId = useChainId();

  return useInfiniteQuery({
    queryKey: ['bridge', address, 'history'],
    queryFn: ({ pageParam }) =>
      client.bridge[':chainId'][':address'].history
        .$get({
          param: { chainId, address },
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
  const child = useChainId();
  const parent = useParentChainId();

  return useMutation<ITxRequest, unknown, { symbol: IToken; amount: string }>({
    mutationKey: ['bridge', address, 'approve'],
    mutationFn: async (params) =>
      client.bridge[':parent'][':child'][':address'].approve[':symbol'][
        ':amount'
      ]
        .$get({ param: { parent, child, address, ...params } })
        .then((res) => res.json())
        .then(decodeTxRequest)
  });
};

export const useBridgeDepositTx = () => {
  const account = useAccount();
  const address = account.address as Hex;
  const ref = useReferral();
  const child = useChainId();
  const parent = useParentChainId();

  return useMutation<ITxRequest, unknown, { symbol: IToken; amount: string }>({
    mutationKey: ['bridge', address, 'deposit'],
    mutationFn: async (params) =>
      client.bridge[':parent'][':child'][':address'].deposit[':symbol'][
        ':amount'
      ]
        .$get({
          param: { parent, child, address, ...params },
          query: { ref }
        })
        .then((res) => res.json())
        .then(decodeTxRequest)
  });
};

export const useBridgeWithdrawTx = () => {
  const account = useAccount();
  const address = account.address as Hex;
  const child = useChainId();
  const parent = useParentChainId();

  return useMutation<ITxRequest, unknown, { symbol: IToken; amount: string }>({
    mutationKey: ['bridge', address, 'withdraw'],
    mutationFn: async (params) =>
      client.bridge[':parent'][':child'][':address'].withdraw[':symbol'][
        ':amount'
      ]
        .$get({ param: { parent, child, address, ...params } })
        .then((res) => res.json())
        .then(decodeTxRequest)
  });
};

/**
 * Faucet
 */

export const useClaimTo = () => {
  const account = useAccount();
  const address = account.address as Hex;
  const chainId = useChainId();

  return useMutation<Hex, unknown, { token: string }>({
    mutationKey: ['faucet', address, 'claimTo'],
    mutationFn: async ({ token }) =>
      client.claim[':chainId'][':address'].exec
        .$post({
          param: { chainId, address },
          json: { token }
        })
        .then((res) => res.json())
  });
};

export const useClaimEligilibity = () => {
  const account = useAccount();
  const address = account.address as Hex;
  const chainId = useChainId();

  return useQuery({
    queryKey: ['faucet', chainId, address, 'eligibility'],
    queryFn: () =>
      client.claim[':chainId'][':address'].eligibility
        .$get({ param: { chainId, address } })
        .then((res) => res.json()),
    enabled: account.isConnected
  });
};

/**
 * Community Rewards & Allocations
 */

export const useCommunityAllocations = () => {
  return useQuery({
    queryKey: ['rewards', 'communities'],
    queryFn: () => client.rewards.communities.$get().then((res) => res.json()),
    initialData: []
  });
};

export const useCommunityRewards = () => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ['rewards', address],
    queryFn: () =>
      client.rewards[':address']
        .$get({
          param: { address: address as string }
        })
        .then((res) => res.json()),
    enabled: Boolean(address),
    initialData: { total: 0, history: [] }
  });
};

export const useCommunityRewardsHistory = () => {
  const { address } = useAccount();

  return useInfiniteQuery({
    queryKey: ['rewards', 'list', address],
    queryFn: ({ pageParam }) =>
      client.rewards[':address'].history
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
