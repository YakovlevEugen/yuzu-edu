import { Captcha } from '@/components/Captcha';
import { useCaptcha } from '@/components/CaptchaProvider';
import WalletConnectFilter from '@/containers/WalletConnectFilter';
import { cn } from '@/helpers/lib';
import { useClaimTo } from '@/hooks/api';
import { useToast } from '@/hooks/use-toast';
import type { IEligibility } from '@yuzu/api';
import { useCallback, useMemo } from 'react';
import { Button } from 'ui/button';

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
  const captcha = useCaptcha();
  const { toast } = useToast();
  const claimTo = useClaimTo();

  const claim = useCallback(async () => {
    try {
      const signature = await claimTo.mutateAsync({
        token: captcha.token ?? 'xxx'
      });
      console.log({ signature });
      refresh();
      toast({ title: 'Successfully Claimed 0.1 EDU', variant: 'success' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to claim', variant: 'destructive' });
    }
  }, [claimTo, captcha.token, refresh, toast]);

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
