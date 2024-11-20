export interface Wallet {
  id: string
  amount: number
}

export interface WalletContext {
  wallet?: Wallet
}
