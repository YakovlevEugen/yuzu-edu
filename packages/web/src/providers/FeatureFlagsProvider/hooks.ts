import { createContext, useContext } from 'react';

import type { Maybe } from '@/types/common';

export type IFeatureFlagContext = Maybe<{
  flags: string[];
  variants: Record<string, string | boolean>;
}>;

export const FeatureFlagContext = createContext<IFeatureFlagContext>(undefined);

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error(
      'useFeatureFlags must be used within a FeatureFlagsProvider'
    );
  }
  return context;
};
