import { parseEther } from 'viem'
import { useAccount, useSendTransaction } from 'wagmi'

import { Button } from 'ui/button'
import WalletConnect from '@/containers/WalletConnect'

import { cn } from '@/helpers/lib'
import { useToast } from '@/hooks/use-toast'

export interface Props {
  className?: string
}

export default function ActionButton({ className }: Props) {
  const { isConnected } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()
  const { toast } = useToast()

  const classRoot = cn('', className)
  const isClaimed = false
  const isConfirming = false
  const value = '2132' // TODO: integrate with wallet

  async function claim() {
    try {
      await sendTransactionAsync({
        to: '0xDbD8e8bc1A1b6a563d4b9F75F72E577C42890fF7',
        value: parseEther(value)
      })
      toast({ title: 'EDU Successfully Claimed', variant: 'success' })
    } catch (error) {
      toast({ title: 'EDU Claim Failed', variant: 'destructive' })
      console.error(error)
    }
  }

  return (
    <div className={classRoot}>
      {isConnected ? (
        <Button className="w-full" disabled={!value | isConfirming | isClaimed} size="lg" onClick={claim}>
          {isConfirming ? 'Confirm on Wallet...' : isClaimed ? 'Claimed' : 'Claim'}
        </Button>
      ) : (
        <WalletConnect triggerProps={{ className: 'w-full', size: 'lg' }} />
      )}
    </div>
  )
}
