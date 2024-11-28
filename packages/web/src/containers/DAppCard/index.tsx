import { cn } from '@/helpers/lib'
import { IDAppCard } from '@/types/wallet'

interface Props extends IDAppCard {
  className?: string
}

export default function DAppCard({ className, avatarUrl, dAppName, userNick }: Props) {
  const classRoot = cn('flex items-center gap-x-2', className)

  return (
    <div className={classRoot}>
      <div className="shrink-0">
        <img className="h-10 w-10" src={avatarUrl ?? 'No Avatar'} alt="DApp User Avatar" />
      </div>
      <div>
        {Boolean(dAppName) && <div className="mb-1 text-sm font-semibold text-grass">{dAppName}</div>}
        {Boolean(userNick) && <div className="text-xs">{userNick}</div>}
      </div>
    </div>
  )
}
