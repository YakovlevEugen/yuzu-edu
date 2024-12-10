import { useRef, useEffect } from 'react'

import { TabsContent, Tabs } from 'ui/tabs'
import BorderBlock from '@/components/BorderBlock'
import RoundedTabs from '@/components/RoundedTabs'
import TabBridgeRewards from '../TabBridgeRewards'
import TabCommunityCampaigns from '../TabCommunityCampaigns'
import TabDApps from '../TabDApps'

import { cn } from '@/helpers/lib'
import { ITab } from '@/types/components'

interface Props {
  className?: string
}

const TABS: ITab[] = [
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
      <RoundedTabs ref={refTabs} tabs={TABS} />

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
