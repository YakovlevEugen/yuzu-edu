import { createContext, useContext } from 'react';

import type { Maybe } from '@/types/common';
import type { TPostHog } from './index';

export type IPostHogContext = Maybe<TPostHog>;

export const PostHogContext = createContext<IPostHogContext>(undefined);

export const usePostHog = () => {
  return useContext(PostHogContext);
};
