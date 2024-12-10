import { cn } from '@/helpers/lib'
import { IInfoItem } from '@/types/components'

interface Props extends IInfoItem {
  className?: string
}

export default function InfoItem({ className, title = '', value = '' }: Props) {
  const classRoot = cn('flex justify-between gap-x-2.5', className)

  return (
    <div className={classRoot}>
      <div>{title}</div>
      <div className="flex-none font-semibold text-green">{value}</div>
    </div>
  )
}
