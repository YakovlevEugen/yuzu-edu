import { useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Footer from './components/Footer'
import Header from './components/Header'

import { ROUTES } from '@/constants/routes'
import { cn } from '@/helpers/lib'

interface Props {
  className?: string
}

export default function MainLayout({ className }: Props) {
  const { pathname } = useLocation()

  const pageBackground = useMemo(() => {
    let backgroundClass = 'bg-center bg-cover bg-no-repeat '

    if (pathname === ROUTES.land) {
      backgroundClass += 'md:bg-top bg-edu-land-background'
    } else if (pathname === ROUTES.faucet) {
      backgroundClass += 'bg-edu-faucet-background'
    } else if (pathname === ROUTES.bridge) {
      backgroundClass += 'bg-bridge-background'
    }

    return backgroundClass
  }, [pathname])

  const classRoot = cn('flex flex-col min-h-screen', className)

  return (
    <div className={classRoot}>
      <div className={cn({ [`${pageBackground}`]: pageBackground }, 'flex-[1]')}>
        <div className="mx-auto flex w-full max-w-[1116px] flex-col overflow-hidden md:px-5 md:py-8">
          <Header />

          <div className="mt-5 px-4 md:mt-[100px] md:p-0">
            <Outlet />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
