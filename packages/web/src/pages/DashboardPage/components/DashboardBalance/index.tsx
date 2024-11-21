import { Button } from 'ui/button'
import Balance from '@/components/Balance'
import BorderBlock from '@/components/BorderBlock'

import { cn } from '@/helpers/lib'

interface Props {
  className?: string
}

export default function BalanceBlock({ className }: Props) {
  const classRoot = cn('shadow-none', className)

  return (
    <BorderBlock className={classRoot} padding="none" variant="yellow">
      <div className="xs:p-border-box relative flex justify-between p-border-box-sm lg:pb-0">
        <div className="z-[1] w-full">
          <div className="mb-6 font-bold">@ab123.edu</div>
          <Balance classAmount="text-green-toxic" value={'109828723'} />
        </div>
        <div className="absolute bottom-0 right-0 shrink-0 self-end lg:static lg:-mt-[130px]">
          <img className="h-[150px] lg:h-[260px]" src="/images/capybara-selfie.png" alt="Capybara Take a Selfie" />
        </div>
      </div>

      <BorderBlock
        className="flex items-center justify-between rounded-b-xl border-0 border-y-2 shadow-none"
        padding="sm"
        variant="darkGreen"
      >
        <div className="font-bold">
          <div className="text-white">Claimable Yuzu</div>
          <div className="mt-3 text-2xl text-green-toxic">34,828</div>
        </div>
        <div>
          <Button>Claim</Button>
        </div>
      </BorderBlock>
    </BorderBlock>
  )
}
