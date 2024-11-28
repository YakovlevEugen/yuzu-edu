import { FC, useRef, useEffect } from 'react'

import { TabsList, TabsTrigger, TabsContent, Tabs } from 'ui/tabs'
import BorderBlock from '@/components/BorderBlock'
import TabBridgeRewards from '../TabBridgeRewards'
import TabCommunityCampaigns from '../TabCommunityCampaigns'
import TabDApps from '../TabDApps'

import { cn } from '@/helpers/lib'

interface Props {
  className?: string
}

interface Tab {
  id: string
  contentComponent: FC
  disabled?: boolean
  title: string
}

const TABS: Tab[] = [
  {
    id: 'dApps',
    contentComponent: TabDApps,
    disabled: false,
    title: 'DApps'
  },
  {
    id: 'eduStacking',
    contentComponent: () => <div>EDU Staking</div>,
    disabled: true,
    title: 'EDU Staking'
  },
  {
    id: 'communityCampaigns',
    contentComponent: TabCommunityCampaigns,
    disabled: false,
    title: 'Community Campaigns'
  },
  {
    id: 'bridgeRewards',
    contentComponent: TabBridgeRewards,
    disabled: false,
    title: 'Bridge Rewards'
  }
]

export default function TabsDashboard({ className }: Props) {
  const refTabs = useRef<HTMLDivElement>()

  const classRoot = cn('', className)

  useEffect(() => {
    if (refTabs.current) {
      const activeTabElement = refTabs.current?.querySelector('[data-state="active"]') as HTMLElement
      const scrollPosition = activeTabElement?.offsetLeft - refTabs.current?.offsetLeft

      refTabs.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
    }
  }, [])

  return (
    <Tabs className={classRoot} defaultValue={TABS[0].id}>
      <BorderBlock className="overflow-hidden rounded-[100px] shadow-none" padding="none">
        <TabsList ref={refTabs} className="flex justify-normal overflow-x-scroll">
          {TABS.map(({ id, disabled, title }) => (
            <TabsTrigger key={id} className="flex-[1]" disabled={disabled} value={id}>
              {title}
            </TabsTrigger>
          ))}
        </TabsList>
      </BorderBlock>

      {TABS.map(({ id, contentComponent: Content }) => (
        <TabsContent key={id} className="mt-2" value={id}>
          <BorderBlock className="!p-6 shadow-none">
            <Content />
          </BorderBlock>
        </TabsContent>
      ))}
    </Tabs>
  )
}
