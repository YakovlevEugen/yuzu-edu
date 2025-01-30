export interface IWallet {
  id: string;
  amount: number;
}

export interface IWalletContext {
  wallet?: IWallet;
}

export interface IBridgeReward {
  address?: string;
  amount: string;
  points: string;
  timestamp: string;
}

export interface ICommunityCampaignItem {
  community: string;
  points: string;
  type?: string;
  wallet: string;
}
export type TCommunityCampaignItemKeys = keyof ICommunityCampaignItem;

export interface IDAppCard {
  avatarUrl?: string;
  dAppName: string;
  userNick: string;
}

export interface IDApp extends IDAppCard {
  points: string;
  type: string;
}
