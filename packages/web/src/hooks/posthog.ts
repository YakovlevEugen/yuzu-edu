import { useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAccountEffect } from 'wagmi';

import { useReferral } from '@/hooks/use-referral';
import { usePostHog } from '@/providers/PostHogProvider/hooks';

/**
 * Page Tracking
 */

export function usePageTracking() {
  const location = useLocation();
  const posthog = usePostHog();

  // biome-ignore lint/correctness/useExhaustiveDependencies: should send event on change location
  useEffect(() => {
    posthog?.capture('$pageview');
  }, [posthog, location]);
}

/**
 * Track UA events
 */

type ITraits = Record<string, string | number | boolean | null | undefined> & {
  $set?: Record<string, string | number | boolean | null | undefined>;
  $set_once?: Record<string, string | number | boolean | null | undefined>;
};

export function useAnalytics() {
  const posthog = usePostHog();

  const track = useCallback(
    (eventName: string, traits?: ITraits) =>
      posthog?.capture(eventName, traits),
    [posthog]
  );

  const updateSession = useCallback(
    (traits: ITraits) => posthog?.register(traits),
    [posthog]
  );

  const signIn = useCallback(
    (userId: string, traits?: ITraits) => posthog?.identify(userId, traits),
    [posthog]
  );

  const signOut = useCallback(() => posthog?.reset(), [posthog]);

  return useMemo(
    () => ({ track, signIn, signOut, updateSession }),
    [track, signIn, signOut, updateSession]
  );
}

/**
 * Track wallet connections
 */

export function useWalletTracking() {
  const { track, signIn, signOut } = useAnalytics();
  const referral = useReferral();

  useAccountEffect({
    onConnect: ({ address, chainId }) => {
      signIn(address, { address, chainId });
      track('wallet_connected', { address, chainId, referral });
    },
    onDisconnect: () => {
      track('wallet_disconnected');
      signOut();
    }
  });
}
