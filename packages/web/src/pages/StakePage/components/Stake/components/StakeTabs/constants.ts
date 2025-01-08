import type { IStakeTabs } from './index';

export const TABS: IStakeTabs[] = [
  {
    id: 'stake',
    disabled: false,
    title: 'Stake'
  },
  {
    id: 'unwrap',
    disabled: false,
    title: 'Unwrap'
  }
];

export const DEFAULT_ACTIVE_TAB = TABS[0].id;
