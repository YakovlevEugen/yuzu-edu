import { Route, Routes } from 'react-router-dom'

import MainLayout from '@/layouts/MainLayout'
import ErrorPage from '@/pages/ErrorPage'
import HomePage from '@/pages/HomePage'

import { ROUTES } from '@/constants/routes'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.home} index element={<HomePage />} />
      </Route>
      <Route path="*" element={<ErrorPage status={404} />} />
    </Routes>
  )
}
