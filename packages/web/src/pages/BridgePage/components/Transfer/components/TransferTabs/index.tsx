import RoundedTabs from '@/components/RoundedTabs'
import { cn } from '@/helpers/lib'
import { Tabs } from 'ui/tabs'

export const TABS = [
  {
    id: 'deposit' as const,
    disabled: false,
    title: 'Deposit'
  },
  {
    id: 'withdraw' as const,
    disabled: false,
    title: 'Withdraw'
  }
]

type ITabId = (typeof TABS)[number]['id']

export default function TransferTabs({
  className,
  value,
  onChange
}: {
  className?: string
  value: ITabId
  onChange: (v: ITabId) => void
}) {
  return (
    <Tabs
      className={cn('', className)}
      defaultValue={TABS[0].id}
      value={value}
      onValueChange={(v) => onChange?.(v as ITabId)}
    >
      <RoundedTabs tabs={TABS} />
    </Tabs>
  )
}
