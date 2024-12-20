import { Tabs } from 'ui/tabs'
import RoundedTabs from '@/components/RoundedTabs'

import { cn } from '@/helpers/lib'
import { TABS } from './constants'

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
