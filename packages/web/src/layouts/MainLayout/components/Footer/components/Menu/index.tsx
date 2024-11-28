import { Link } from 'react-router-dom'

import { cn } from '@/helpers/lib'

interface Props {
  className?: string
}

interface MenuChild {
  label: string
  link: string
}
interface Menu {
  title: string
  children: MenuChild[]
}

const MENU: Menu[] = new Array(4).fill({
  title: 'Products',
  children: [
    {
      label: 'OC ID',
      link: '#'
    },
    {
      label: 'OC-X',
      link: '#'
    },
    {
      label: 'Publisher NFT',
      link: '#'
    },
    {
      label: 'Whitepaper',
      link: '#'
    }
  ]
})

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
                  <Link to={link}>{label}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
