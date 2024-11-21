import { ReactNode, useRef, useEffect } from 'react'

import { TabsList, TabsTrigger, TabsContent, Tabs } from 'ui/tabs'
import BorderBlock from '@/components/BorderBlock'
import TabBridgeRewards from '../TabBridgeRewards'

import { cn } from '@/helpers/lib'

interface Props {
  className?: string
}

interface Tab {
  id: string
  contentComponent: ReactNode
  disabled: boolean
  title: string
}

const TABS: Tab[] = [
  {
    id: 'dApps',
    contentComponent: () => <div>DApps</div>,
    disabled: true,
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
    contentComponent: () => <div>Community Campaigns</div>,
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

export default function DashboardTabs({ className }: Props) {
  const refTabs = useRef<HTMLElement>()

  const classRoot = cn('', className)

  useEffect(() => {
    if (refTabs.current) {
      const activeTabElement = refTabs.current?.querySelector('[data-state="active"]')
      const scrollPosition = activeTabElement?.offsetLeft - refTabs.current.offsetLeft

      refTabs.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
    }
  }, [])

  return (
    <Tabs className={classRoot} defaultValue="bridgeRewards">
      <BorderBlock className="overflow-hidden rounded-[100px] shadow-none" padding="none">
        <TabsList ref={refTabs} className="flex justify-normal overflow-x-scroll">
          {TABS.map(({ id, disabled, title }) => (
            <TabsTrigger className="flex-[1]" key={id} disabled={disabled} value={id}>
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
