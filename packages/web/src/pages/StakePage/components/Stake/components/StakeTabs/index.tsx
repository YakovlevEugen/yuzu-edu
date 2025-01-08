import { forwardRef } from 'react';

import RoundedTabs from '@/components/RoundedTabs';
import { Tabs } from 'ui/tabs';

import { cn } from '@/helpers/lib';
import type { ITab } from '@/types/components';
import { DEFAULT_ACTIVE_TAB, TABS } from './constants';

export type TStakeTabId = 'stake' | 'unwrap';

export interface TStakeTabs extends Omit<ITab, 'id'> {
  id: TStakeTabId;
}

interface Props {
  className?: string;
  tabs?: TStakeTabs[];
  value?: string;
  onChange?: (tabId: TStakeTabId) => void;
}

const StakeTabs = forwardRef<HTMLDivElement, Props>(
  ({ className, tabs, value, onChange }, ref) => {
    const classRoot = cn('', className);
    const resultValue = value ?? DEFAULT_ACTIVE_TAB;
    const resultTabs = tabs ?? TABS;

    function handleChange(tabId: string) {
      onChange?.(tabId as TStakeTabId);
    }

    return (
      <Tabs
        className={classRoot}
        defaultValue={DEFAULT_ACTIVE_TAB}
        value={resultValue}
        onValueChange={handleChange}
      >
        <RoundedTabs ref={ref} tabs={resultTabs} />
      </Tabs>
    );
  }
);

export default StakeTabs;
