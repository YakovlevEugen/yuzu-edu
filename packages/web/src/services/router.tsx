import { Route, Routes } from 'react-router-dom'

import MainLayout from '@/layouts/MainLayout'
import DashboardPage from '@/pages/DashboardPage'
import EDUFaucetPage from '@/pages/EDUFaucetPage'
import ErrorPage from '@/pages/ErrorPage'
import StakePage from '@/pages/StakePage'

import { ROUTES } from '@/constants/routes'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.dashboard} index element={<DashboardPage />} />
        <Route path={ROUTES.stake} element={<StakePage />} />
        <Route path={ROUTES.faucet} element={<EDUFaucetPage />} />
      </Route>
      <Route path="*" element={<ErrorPage status={404} />} />
    </Routes>
  )
}
