import { Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from '@/layouts/MainLayout';
import BridgePage from '@/pages/BridgePage';
import EDUFaucetPage from '@/pages/EDUFaucetPage';
import EDULandPage from '@/pages/EDULandPage';
import ErrorPage from '@/pages/ErrorPage';
import StakePage from '@/pages/StakePage';

import { ROUTES } from '@/constants/routes';
import ExternalRedirect from '@/pages/ExternalRedirect';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path={ROUTES.home}
          element={<Navigate to={ROUTES.stake} replace />}
        />
        <Route path={ROUTES.stake} element={<StakePage />} />
        <Route path={ROUTES.community} element={<EDULandPage />} />
        <Route path={ROUTES.faucet} element={<EDUFaucetPage />} />
        <Route path={ROUTES.bridge} element={<BridgePage />} />
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
      </Route>
      <Route path="*" element={<ErrorPage status={404} />} />
    </Routes>
  );
}
