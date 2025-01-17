import { forwardRef } from 'react';

import BorderBlock from '@/components/BorderBlock';
import { TabsList, TabsTrigger } from 'ui/tabs';

import { cn } from '@/helpers/lib';
import type { ITab } from '@/types/components';

interface Props {
  className?: string;
  tabs: ITab[];
}

const RoundedTabs = forwardRef<HTMLDivElement, Props>(
  ({ className, tabs }, ref) => {
    const classRoot = cn(
      'overflow-hidden rounded-[100px] shadow-none',
      className
    );

    return (
      <BorderBlock className={classRoot} padding="none">
        <TabsList ref={ref} className="flex justify-normal overflow-x-auto">
          {tabs.map(({ id, disabled, title }) => (
            <TabsTrigger
              key={id}
              className="flex-[1]"
              disabled={disabled}
              value={id}
            >
              {title}
            </TabsTrigger>
          ))}
        </TabsList>
      </BorderBlock>
    );
  }
);

export default RoundedTabs;
