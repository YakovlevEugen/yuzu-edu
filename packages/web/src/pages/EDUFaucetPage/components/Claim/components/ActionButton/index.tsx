import type { IEligibility } from '@yuzu/api';
import { useCallback, useMemo } from 'react';

import { Captcha } from '@/components/Captcha';
import { useCaptcha } from '@/components/CaptchaProvider';
import WalletConnectFilter from '@/containers/WalletConnectFilter';
import { Button } from 'ui/button';

import { cn } from '@/helpers/lib';
import { useClaimTo } from '@/hooks/api';
import { useAnalytics } from '@/hooks/posthog';
import { useChainId } from '@/hooks/use-chain-id';
import { useEnsureChain } from '@/hooks/use-ensure-chain';
import { useToast } from '@/hooks/use-toast';

interface Props {
  className?: string;
  eligibility: IEligibility;
  refresh: () => unknown;
}

export default function ActionButton({
  className,
  eligibility,
  refresh
}: Props) {
  const { track } = useAnalytics();
  const captcha = useCaptcha();
  const { toast } = useToast();
  const claimTo = useClaimTo();
  const ensureChain = useEnsureChain();
  const chainId = useChainId();

  const claim = useCallback(async () => {
    try {
      track('claim_edu_started', { chainId });
      await ensureChain(chainId);
      const signature = await claimTo.mutateAsync({
        token: captcha.token ?? 'xxx'
      });
      console.log({ signature });
      toast({ title: 'Successfully Claimed 0.1 EDU', variant: 'success' });
      track('claim_edu_success', { chainId, signature });
    } catch (error) {
      toast({ title: 'Failed to claim', variant: 'destructive' });
      track('claim_edu_failure', {
        message: (error as { message: string }).message,
        isError: true
      });
      console.error(error);
    } finally {
      refresh();
      captcha.reset();
    }
  }, [track, chainId, ensureChain, claimTo, captcha, toast, refresh]);

  const state = useMemo(() => {
    if (claimTo.isPending) return 'claiming';
    return eligibility;
  }, [eligibility, claimTo]);

  const label = useMemo(() => {
    switch (state) {
      case 'not-eligible':
        return 'Not Eligible';
      case 'claiming':
        return 'Claiming...';
      case 'claimed':
        return 'Already Claimed';
      case 'eligible':
        return 'Claim';
    }
  }, [state]);

  const disabled = useMemo(() => {
    switch (state) {
      case 'claiming':
      case 'claimed':
      case 'not-eligible':
        return true;
      case 'eligible':
        return false;
    }
  }, [state]);

  return (
    <div className={cn(className)}>
      <WalletConnectFilter triggerClass="w-full" triggerProps={{ size: 'lg' }}>
        <Captcha>
          <Button
            className="w-full"
            size="lg"
            type="submit"
            onClick={claim}
            disabled={disabled}
          >
            {label}
          </Button>
        </Captcha>
      </WalletConnectFilter>
    </div>
  );
}
