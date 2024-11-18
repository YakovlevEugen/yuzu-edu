import { NavLink } from 'react-router-dom'

import { cn } from '@/helpers/lib'
import { MENU } from './constants'

export interface Props {
  className?: string
}

export default function Menu({ className }: Props) {
  const classRoot = cn('flex flex-col md:flex-row gap-y-8 md:gap-y-0 md:gap-x-4 mt-8 md:mt-0', className)

  function getClassLink({ isActive }) {
    return cn('flex items-center text-gray font-semibold', { 'text-gray-light': isActive })
  }

  return (
    <div className={classRoot}>
      {MENU.map(({ to, title }) => (
        <NavLink className={getClassLink} key={to} to={to}>
          {title}
        </NavLink>
      ))}
    </div>
  )
}
