import DashboardBalance from './components/DashboardBalance'
import DashboardTabs from './components/tabs/TabsDashboard'

import { cn } from '@/helpers/lib'

interface Props {
  className?: string
}

export default function DashboardPage({ className }: Props) {
  const classRoot = cn(
    'md:px-[40px]',
    `before:content-[''] before:fixed before:left-0 before:bottom-0 before:w-full before:h-2/5 before:bg-grass before:-z-[1]`,
    className
  )

  return (
    <div className={classRoot}>
      <DashboardBalance />

      <DashboardTabs className="mt-4" />

      <img className="fixed bottom-10 left-0 -z-[1]" src="/images/tree.svg" alt="Tree" />
    </div>
  )
}
