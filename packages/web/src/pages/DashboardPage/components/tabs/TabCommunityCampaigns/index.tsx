import TableCommunityCampaigns from '../../tables/TableCommunityCampaigns'

import { cn } from '@/helpers/lib'

interface Props {
  className?: string
}

export default function TabCommunityCampaigns({ className }: Props) {
  const classRoot = cn('', className)

  return (
    <div className={classRoot}>
      <TableCommunityCampaigns />
    </div>
  )
}
