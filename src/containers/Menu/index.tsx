import MenuLink from '@/containers/MenuLink'

import { cn } from '@/helpers/lib'
import { MENU } from './constants'

export interface Props {
  className?: string
}

export default function Menu({ className }: Props) {
  const classRoot = cn('flex flex-col md:flex-row gap-y-8 md:gap-y-0 md:gap-x-4 mt-8 md:mt-0', className)

  return (
    <div className={classRoot}>
      {MENU.map(({ to, title }) => (
        <MenuLink key={to} to={to}>
          {title}
        </MenuLink>
      ))}
    </div>
  )
}
