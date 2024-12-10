import { cn } from '@/helpers/lib'
import { MENU } from './constants'

interface Props {
  className?: string
}

export default function Menu({ className }: Props) {
  const classRoot = cn('flex flex-wrap gap-x-10 lg:gap-x-[60px] gap-y-6', className)

  return (
    <div className={classRoot}>
      {MENU.map(({ children, title }) => (
        <div key={title} className="flex flex-col">
          {Boolean(title) && <div className="mb-1 text-lg font-bold uppercase text-green-toxic">{title}</div>}
          {Boolean(children.length) && (
            <ul className="flex flex-col">
              {children.map(({ label, link }) => (
                <li key={label} className="mt-1 text-lg font-normal">
                  <a href={link} target="_blank" rel="noopenner noreferrer">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
