import SvgIcon from '@/components/SvgIcon'

import { cn } from '@/helpers/lib'

interface Props {
  className?: string
}

interface Social {
  link: string
  iconName: 'linked-in' | 'telegram' | 'x' | 'youtube'
}

const SOCIALS: Social[] = [
  {
    iconName: 'x',
    link: 'https://x.com/'
  },
  {
    iconName: 'youtube',
    link: 'https://www.youtube.com/'
  },
  {
    iconName: 'telegram',
    link: 'https://t.me'
  },
  {
    iconName: 'linked-in',
    link: 'https://www.linkedin.com/'
  }
]

export default function Socials({ className }: Props) {
  const classRoot = cn('flex gap-x-3', className)

  return (
    <ul className={classRoot}>
      {SOCIALS.map(({ iconName, link }) => (
        <li key={iconName}>
          <a
            className="block rounded-[50%] border border-green-light/25 p-3 text-green-light hover:text-green-light/75"
            href={link}
            rel="nofollow noopener noreferrer"
            target="_blank"
          >
            <SvgIcon name={iconName} />
          </a>
        </li>
      ))}
    </ul>
  )
}
