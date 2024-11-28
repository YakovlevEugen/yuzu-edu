import TableDApps from '../../tables/TableDApps'

import { cn } from '@/helpers/lib'

interface Props {
  className?: string
}

export default function TabDApps({ className }: Props) {
  const classRoot = cn('', className)

  return (
    <div className={classRoot}>
      <TableDApps />
    </div>
  )
}
