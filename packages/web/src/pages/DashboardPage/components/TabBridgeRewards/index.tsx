import { Button } from 'ui/button'
import BackgroundBlock from '@/components/BackgroundBlock'
import SvgIcon from '@/components/SvgIcon'
import HistoryTable from '../HistoryTable'

import { cn } from '@/helpers/lib'

interface Props {
  className?: string
}

export default function TabBridgeRewards({ className }: Props) {
  const classRoot = cn('', className)

  return (
    <div className={classRoot}>
      <BackgroundBlock className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <SvgIcon className="shrink-0 text-[50px]" name="orange" />
          <div className="text-center md:text-left md:text-xl">
            Earn <span className="text-orange">Yuzu</span> by bridging tokens to EDU Chain Mainnet
          </div>
        </div>
        <div>
          <Button>Bridge</Button>
        </div>
      </BackgroundBlock>

      <HistoryTable />
    </div>
  )
}
