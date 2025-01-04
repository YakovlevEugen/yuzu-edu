import { Route, Routes } from 'react-router-dom';

import MainLayout from '@/layouts/MainLayout';
import BridgePage from '@/pages/BridgePage';
import DashboardPage from '@/pages/DashboardPage';
import EDUFaucetPage from '@/pages/EDUFaucetPage';
import EDULandPage from '@/pages/EDULandPage';
import ErrorPage from '@/pages/ErrorPage';
import StakePage from '@/pages/StakePage';

import { ROUTES } from '@/constants/routes';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.dashboard} index element={<DashboardPage />} />
        <Route path={ROUTES.stake} element={<StakePage />} />
        <Route path={ROUTES.land} element={<EDULandPage />} />
        <Route path={ROUTES.faucet} element={<EDUFaucetPage />} />
        <Route path={ROUTES.bridge} element={<BridgePage />} />
      </Route>
      <Route path="*" element={<ErrorPage status={404} />} />
    </Routes>
  );
}
