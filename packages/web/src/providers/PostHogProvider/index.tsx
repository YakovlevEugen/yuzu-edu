import posthog from 'posthog-js';
import { type PropsWithChildren, useLayoutEffect, useState } from 'react';

import { postHogHost, postHogKey } from '@/constants/config';
import { type IPostHogContext, PostHogContext } from './hooks';

export type TPostHog = typeof posthog;

export function PostHogProvider({ children }: PropsWithChildren) {
  const [value, setValue] = useState<IPostHogContext>();

  useLayoutEffect(() => {
    posthog.init(postHogKey, { ui_host: postHogHost });
    setValue(posthog);
  }, []);

  return (
    <PostHogContext.Provider value={value}>{children}</PostHogContext.Provider>
  );
}
