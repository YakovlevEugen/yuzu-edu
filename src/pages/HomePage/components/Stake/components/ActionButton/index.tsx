import { useFormContext } from 'react-hook-form'

import { Button } from 'ui/button'
import ConnectWalletButton from '@/containers/ConnectWalletButton'

import { cn } from '@/helpers/lib'
import { useWallet } from '@/providers/wallet/hook'
import { useToast } from '@/hooks/use-toast'

export interface Props {
  className?: string
}

export default function ActionButton({ className }: Props) {
  const { toast } = useToast()
  const { watch } = useFormContext()
  const { wallet } = useWallet()

  const classRoot = cn('', className)
  const topUp = watch('topUp')

  return (
    <div className={classRoot}>
      {wallet?.id ? (
        <Button
          className="w-full"
          disabled={!topUp}
          size="lg"
          onClick={() => toast({ title: 'Test', variant: 'success' })}
        >
          Stake
        </Button>
      ) : (
        <ConnectWalletButton className="w-full" size="lg" />
      )}
    </div>
  )
}
