import { ICommunityCampaign } from '@/types/wallet'

export const rewardsHistory: ICommunityCampaign[] = new Array(15).fill({
  community: 'Community 1',
  points: '1000',
  pointsDistributed: '24.7B of 25.3B Yuzu',
  type: 'Testnet farming'
})
