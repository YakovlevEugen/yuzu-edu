import { cn } from '@/helpers/lib'

export interface Props {
  className?: string
}

export default function DashboardPage({ className }: Props) {
  const classRoot = cn('', className)

  return <div className={classRoot}>DashboardPage</div>
}
