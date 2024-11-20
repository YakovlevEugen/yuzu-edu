import { cva } from 'class-variance-authority'
import { NavLink } from 'react-router-dom'

import { cn } from '@/helpers/lib'

const variants = cva('flex items-center text-gray-light font-semibold', {
  variants: {
    active: {
      deafult: 'text-gray-light',
      true: 'text-gray'
    }
  },
  defaultVariants: {
    active: 'default'
  }
})

interface Props extends NavLink {
  active?: boolean
}

export default function MenuLink({ active, children, className, ...props }: Props) {
  function getClassLink({ isActive }) {
    return cn(variants({ active: active || isActive }), className)
  }

  return (
    <NavLink className={getClassLink} {...props}>
      {children}
    </NavLink>
  )
}
