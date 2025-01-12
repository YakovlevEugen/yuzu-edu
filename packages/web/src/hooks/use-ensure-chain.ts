import { type IChainId, getChain } from '@yuzu/sdk';
import { useCallback } from 'react';
import { useSwitchChain } from 'wagmi';

export const useEnsureChain = () => {
  const { switchChainAsync } = useSwitchChain();

  return useCallback(
    (chainId: IChainId) => {
      const chain = getChain(chainId);
      return switchChainAsync({ chainId: chain.id });
    },
    [switchChainAsync]
  );
};
