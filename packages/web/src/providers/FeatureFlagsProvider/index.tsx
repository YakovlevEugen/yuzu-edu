import { type PropsWithChildren, useEffect, useState } from 'react';

import { usePostHog } from '@/providers/PostHogProvider/hooks';
import { FeatureFlagContext, type IFeatureFlagContext } from './hooks';

export function FeatureFlagsProvider({ children }: PropsWithChildren) {
  const [value, setValue] = useState<IFeatureFlagContext>();
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.onFeatureFlags((flags, variants) => setValue({ flags, variants }));
  }, [posthog]);

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
}
