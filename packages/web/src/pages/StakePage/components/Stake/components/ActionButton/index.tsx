import { useFormContext } from 'react-hook-form'
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
  const { watch } = useFormContext()
  const { sendTransactionAsync } = useSendTransaction()
  const { toast } = useToast()

  const classRoot = cn('', className)
  const topUp = watch('topUp')

  async function stake() {
    try {
      await sendTransactionAsync({
        to: '0xDbD8e8bc1A1b6a563d4b9F75F72E577C42890fF7',
        value: parseEther(topUp)
      })
      toast({ title: 'EDU Successfully Staked', variant: 'success' })
    } catch (error) {
      toast({ title: 'EDU Stake Failed', variant: 'destructive' })
      console.error(error)
    }
  }

  return (
    <div className={classRoot}>
      {isConnected ? (
        <Button className="w-full" disabled={!topUp} size="lg" onClick={stake}>
          Stake
        </Button>
      ) : (
        <WalletConnect triggerProps={{ className: 'w-full', size: 'lg' }} />
      )}
    </div>
  )
}
