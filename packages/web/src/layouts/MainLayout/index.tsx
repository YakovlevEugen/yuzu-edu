import { Outlet } from 'react-router-dom'

import Footer from './components/Footer'
import Header from './components/Header'

import { cn } from '@/helpers/lib'

interface Props {
  className?: string
}

export default function MainLayout({ className }: Props) {
  const classRoot = cn('flex flex-col min-h-screen', className)

  return (
    <div className={classRoot}>
      <div className="mx-auto flex w-full max-w-[1116px] flex-[1] flex-col overflow-hidden !pb-0 md:px-5 md:py-8">
        <Header />

        <div className="mt-5 px-4 md:mt-[100px] md:p-0">
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  )
}
