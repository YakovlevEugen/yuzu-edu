import { Outlet } from 'react-router-dom'

import Header from './components/Header'

import { cn } from '@/helpers/lib'

interface Props {
  className?: string
}

export default function MainLayout({ className }: Props) {
  const classRoot = cn('min-h-screen pb-5 md:px-5 md:py-8', className)

  return (
    <div className={classRoot}>
      <div className="mx-auto flex max-w-[1076px] flex-col overflow-hidden">
        <Header />

        <div className="mt-5 px-4 md:mt-[100px] md:p-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
