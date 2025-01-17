import { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Helmet from 'react-helmet';
import Footer from './components/Footer';
import Header from './components/Header';

import { ROUTES } from '@/constants/routes';
import { MENU } from '@/containers/Menu/constants';
import WalletConnectFilter from '@/containers/WalletConnectFilter';
import { cn } from '@/helpers/lib';
import { copyToClipboard } from '@/helpers/text';
import { useAnalytics } from '@/hooks/posthog';
import { toast } from '@/hooks/use-toast';
import { Button } from 'ui/button';
import { useAccount } from 'wagmi';

interface Props {
  className?: string;
}

export default function MainLayout({ className }: Props) {
  const { pathname } = useLocation();

  const pageBackground = useMemo(() => {
    let backgroundClass = 'bg-center bg-cover bg-no-repeat ';

    if (pathname === ROUTES.community) {
      backgroundClass += 'md:bg-top bg-edu-land-background';
    } else if (pathname === ROUTES.faucet) {
      backgroundClass += 'bg-edu-faucet-background';
    } else if (pathname === ROUTES.bridge) {
      backgroundClass += 'bg-bridge-background';
    }

    return backgroundClass;
  }, [pathname]);

  const classRoot = cn('flex flex-col min-h-screen', className);
  const pageTitle = MENU.find(({ to }) => to === pathname)?.title;

  return (
    <div className={classRoot}>
      <Helmet>
        <title>Yuzu - Edu Chain{pageTitle ? ` - ${pageTitle}` : ''}</title>
      </Helmet>

      <Ribbon />

      <div
        className={cn({ [`${pageBackground}`]: pageBackground }, 'flex-[1]')}
      >
        <div className="mx-auto flex w-full max-w-[1116px] flex-col overflow-hidden md:px-5 md:py-8">
          <Header />

          <div className="mt-5 px-4 pb-6 md:mt-[100px] md:p-0">
            <Outlet />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

const Ribbon = () => {
  const account = useAccount();
  const referralLink = `${location.origin}?ref=${account.address?.toLowerCase()}`;
  const { track } = useAnalytics();

  const copyReferralLink = async () => {
    try {
      await copyToClipboard(referralLink);
      toast({ title: 'Link Successfully Copied', variant: 'success' });
      track('referral_link_copied', { address: account.address });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full bg-black p-2 text-center text-white">
      <span className="px-2">
        Share referral link and earn extra Yuzu Points!
      </span>

      <WalletConnectFilter triggerProps={{ size: 'sm' }}>
        <Button onClick={copyReferralLink}>Copy Link</Button>
      </WalletConnectFilter>
    </div>
  );
};
