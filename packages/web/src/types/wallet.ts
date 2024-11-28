export interface IWallet {
  id: string
  amount: number
}

export interface IWalletContext {
  wallet?: IWallet
}

export interface IBridgeReward {
  amount: string
  points: string
  timestamp: string
}

export interface ICommunityCampaign {
  community: string
  points: string
  type: string
}

export interface IDAppCard {
  avatarUrl?: string
  dAppName: string
  userNick: string
}

export interface IDApp extends IDAppCard {
  points: string
  type: string
}
