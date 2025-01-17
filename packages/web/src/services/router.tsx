import { Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from '@/layouts/MainLayout';
// import BridgePage from '@/pages/BridgePage';
// import DashboardPage from '@/pages/DashboardPage';
import EDUFaucetPage from '@/pages/EDUFaucetPage';
// import EDULandPage from '@/pages/EDULandPage';
import ErrorPage from '@/pages/ErrorPage';
import ExternalRedirect from '@/pages/ExternalRedirect';
import StakePage from '@/pages/StakePage';

import { ROUTES } from '@/constants/routes';
import { usePageTracking, useWalletTracking } from '@/hooks/posthog';
import { Terms } from '@/pages/Terms';

export default function AppRouter() {
  usePageTracking();
  useWalletTracking();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path={ROUTES.home}
          element={<Navigate to={ROUTES.stake} replace />}
        />

        <Route path={ROUTES.stake} element={<StakePage />} />
        <Route path={ROUTES.faucet} element={<EDUFaucetPage />} />
        {/*<Route path={ROUTES.dashboard} index element={<DashboardPage />} />*/}
        {/*<Route path={ROUTES.community} element={<EDULandPage />} />*/}
        <Route
          path={ROUTES.bridge}
          index
          element={
            <ExternalRedirect path="https://bridge.arbitrum.io/?destinationChain=edu-chain&sourceChain=arbitrum-one" />
          }
        />
        <Route
          path={ROUTES.claim}
          index
          element={<ExternalRedirect path="claim" />}
        />
        <Route
          path={ROUTES.dashboard}
          index
          element={<ExternalRedirect path="dashboard" />}
        />
        <Route
          path={ROUTES.rental}
          index
          element={<ExternalRedirect path="rental" />}
        />

        <Route path={'/toc'} element={<Terms />} />
      </Route>
      <Route path="*" element={<ErrorPage status={404} />} />
    </Routes>
  );
}
