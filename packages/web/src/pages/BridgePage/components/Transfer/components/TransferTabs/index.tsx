import { useEffect, useCallback } from 'react'

import { Tabs } from 'ui/tabs'
import RoundedTabs from '@/components/RoundedTabs'

import { cn } from '@/helpers/lib'
import { ITab } from '@/types/components'

export type TTransferTabId = 'deposit' | 'withdraw'

interface TTransferTab extends Omit<ITab, 'id'> {
  id: TTransferTabId
}

interface Props {
  className?: string
  onChange?: (tabId: TTransferTabId) => void
}

const TABS: TTransferTab[] = [
  {
    id: 'deposit',
    disabled: false,
    title: 'Deposit'
  },
  {
    id: 'withdraw',
    disabled: false,
    title: 'Withdraw'
  }
]

export default function TransferTabs({ className, onChange }: Props) {
  const classRoot = cn('', className)
  const defaultValue = TABS[0].id

  const handleChange = useCallback(
    (tabId: string) => {
      onChange?.(tabId as TTransferTabId)
    },
    [onChange]
  )

  useEffect(() => {
    handleChange(defaultValue)
  }, [defaultValue, handleChange])

  return (
    <Tabs className={classRoot} defaultValue={defaultValue} onValueChange={handleChange}>
      <RoundedTabs tabs={TABS} />
    </Tabs>
  )
}
