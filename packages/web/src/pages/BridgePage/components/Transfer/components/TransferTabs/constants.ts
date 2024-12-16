import { TTransferTab } from './index'

export const TABS: TTransferTab[] = [
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
export const DEFAULT_ACTIVE_TAB = TABS[0].id
