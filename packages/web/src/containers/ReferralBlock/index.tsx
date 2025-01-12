import BackgroundBlock from '@/components/BackgroundBlock';
import { Button } from 'ui/button';

import { ROUTES } from '@/constants/routes';
import { cn } from '@/helpers/lib';
import { copyToClipboard } from '@/helpers/text';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';
import WalletConnectFilter from '../WalletConnectFilter';

interface Props {
  className?: string;
}

export default function ReferralBlock({ className }: Props) {
  const { toast } = useToast();
  const account = useAccount();
  const classRoot = cn('text-center', className);
  const referralLink = `${location.origin}${ROUTES.bridge}?ref=${account.address?.toLowerCase()}`;

  async function copyReferralLink() {
    try {
      await copyToClipboard(referralLink);
      toast({ title: 'Link Successfully Copied', variant: 'success' });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <BackgroundBlock className={classRoot}>
      <div className="font-semibold">Invite your friends to EDUChain</div>
      {/* <div className="mt-2 break-words text-sm text-green">{referralLink}</div> */}
      <div className="mt-4">
        <WalletConnectFilter label="Connect Wallet to get Referral Link">
          <Button className="w-full" onClick={copyReferralLink}>
            Copy Referral Link
          </Button>
        </WalletConnectFilter>
      </div>
    </BackgroundBlock>
  );
}
