import { useAccount } from 'wagmi';

import BackgroundBlock from '@/components/BackgroundBlock';
import { Button } from 'ui/button';
import { Popover, PopoverContent, PopoverTrigger } from 'ui/popover';
import WalletConnectFilter from '../WalletConnectFilter';

import { ROUTES } from '@/constants/routes';
import { cn } from '@/helpers/lib';
import { copyToClipboard } from '@/helpers/text';
import { useAnalytics } from '@/hooks/posthog';
import { useToast } from '@/hooks/use-toast';

interface Props {
  className?: string;
}

export default function ReferralBlock({ className }: Props) {
  const { track } = useAnalytics();
  const { toast } = useToast();
  const account = useAccount();
  const classRoot = cn('text-center', className);
  const referralLink = `${location.origin}${ROUTES.bridge}?ref=${account.address?.toLowerCase()}`;

  async function copyReferralLink() {
    try {
      await copyToClipboard(referralLink);
      toast({ title: 'Link Successfully Copied', variant: 'success' });
      track('referral_link_copied', { address: account.address });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <BackgroundBlock className={classRoot}>
      <div className="font-semibold">Invite your friends to EDUChain</div>
      <Popover>
        <PopoverTrigger asChild>
          <div className="mt-2 inline-block cursor-pointer text-orange">
            Learn more
          </div>
        </PopoverTrigger>
        <PopoverContent>
          You'll earn 10% of your friends' TVL points. Rewards are credited at
          season's end
        </PopoverContent>
      </Popover>
      <div className="mt-4">
        <WalletConnectFilter label="Connect Wallet to get Referral Link">
          <Button className="w-full" onClick={copyReferralLink}>
            Copy Referral Link
          </Button>
        </WalletConnectFilter>
      </div>
      {Boolean(account.address) && (
        <div className="mt-4 break-words text-sm text-green">
          {referralLink}
        </div>
      )}
    </BackgroundBlock>
  );
}
