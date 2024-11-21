import Claim from './components/Claim'

import { cn } from '@/helpers/lib'

interface Props {
  className?: string
}

export default function EDUFaucetPage({ className }: Props) {
  const classRoot = cn(
    `before:content-[''] before:fixed before:left-0 before:bottom-0 before:w-full before:h-2/5 before:bg-grass before:-z-[1]`,
    className
  )

  return (
    <div className={classRoot}>
      <div className="text-center text-4xl font-bold tracking-tighter md:text-6xl">
        Claim <span className="text-orange">Edu</span> for Gas
      </div>

      <div className="mt-[40px] flex items-center gap-x-5">
        <div className="fixed bottom-[10%] left-[10%] -z-[1] md:static md:flex-[1]">
          <img
            className="mt-[40px] w-[218px] md:w-[327px]"
            src="/images/capybara-playing-guitar.png"
            alt="Playing guitar capybara"
          />
        </div>
        <Claim className="flex-[1]" />
      </div>
    </div>
  )
}
