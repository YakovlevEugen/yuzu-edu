/**
 * All icons can be found in @/assets/svg
 * Example:
 <SvgIcon name="coin" />
 */

import { DetailedHTMLProps, HTMLAttributes } from 'react'

import { cn } from '@/helpers/lib'

interface Props extends DetailedHTMLProps<HTMLAttributes<SVGSVGElement>, SVGSVGElement> {
  /** Icon name from svg icons folder */
  name: string
}

export default function SvgIcon({ name, className, ...otherProps }: Props) {
  const classRoot = cn('h-[1em] w-[1em] align-middle fill-current overflow-hidden', className)

  return (
    <svg {...otherProps} className={classRoot} aria-hidden="true">
      <use href={`#icon-${name}`} />
    </svg>
  )
}
