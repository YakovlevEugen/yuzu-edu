export interface Wallet {
  id: string
  amount: number
}

export interface WalletContext {
  wallet?: Wallet
}

export interface BridgeReward {
  date: string
  bridgedAmount: string
  earnedAmount: string
}
