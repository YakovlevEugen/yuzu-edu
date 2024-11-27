import SvgIcon from '@/components/SvgIcon'
import Menu from './components/Menu'

import { cn } from '@/helpers/lib'
import Socials from '@/layouts/MainLayout/components/Footer/components/Socials'

interface Props {
  className?: string
}

export default function Footer({ className }: Props) {
  const classRoot = cn('w-full p-6 lg:px-[120px] lg:py-[90px] bg-foreground text-white', className)

  return (
    <div className={classRoot}>
      <div className="mx-auto max-w-[1200px]">
        <div className="flex gap-x-10 lg:gap-x-[120px]">
          <div>
            <a href="https://opencampus.xyz/" target="_blank">
              <SvgIcon className="h-[31px] w-[157px]" name="logo-open-campus" />
            </a>
          </div>
          <Menu className="hidden md:flex" />
        </div>
        <div className="mt-6 flex flex-col-reverse justify-between md:mt-[85px] md:flex-row md:border-t md:border-white/50 md:pt-[50px]">
          <div className="mt-6 text-sm md:m-0">© {new Date().getFullYear()} Open Campus. All Rights Reserved. </div>
          <div>
            <Socials />
          </div>
        </div>
      </div>
    </div>
  )
}
