import { Tabs } from 'ui/tabs'

import RoundedTabs from '@/components/RoundedTabs'

import { cn } from '@/helpers/lib'
import { ITab } from '@/types/components'

interface Props {
  className?: string
}

const TABS: ITab[] = [
  {
    id: 'deposit',
    disabled: false,
    title: 'Deposit'
  },
  {
    id: 'withdraw',
    disabled: true,
    title: 'Withdraw'
  }
]

export default function TransferTabs({ className }: Props) {
  const classRoot = cn('', className)

  return (
    <Tabs className={classRoot} defaultValue={TABS[0].id}>
      <RoundedTabs tabs={TABS} />
    </Tabs>
  )
}
