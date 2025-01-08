import BackgroundBlock from '@/components/BackgroundBlock';
import { Button } from 'ui/button';

import { ROUTES } from '@/constants/routes';
import { cn } from '@/helpers/lib';
import { copyToClipboard } from '@/helpers/text';
import { useToast } from '@/hooks/use-toast';

interface Props {
  className?: string;
}

export default function ReferralBlock({ className }: Props) {
  const { toast } = useToast();

  const classRoot = cn('text-center', className);
  // TODO: add real referral link
  const referralLink = `${location.origin || 'yuzu.educhain.xyz'}${ROUTES.bridge}/ref=8DN2HS`;

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
      <div className="mt-2 break-words text-sm text-green">{referralLink}</div>
      <div className="mt-4">
        <Button className="w-full" onClick={copyReferralLink}>
          Copy Referral Link
        </Button>
      </div>
    </BackgroundBlock>
  );
}
