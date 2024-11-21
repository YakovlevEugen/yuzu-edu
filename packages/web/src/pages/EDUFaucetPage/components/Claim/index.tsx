import Balance from '@/components/Balance'
import BorderBlock from '@/components/BorderBlock'
import ActionButton from './components/ActionButton'

import { cn } from '@/helpers/lib'

interface Props {
  className?: string
}

export default function Claim({ className }: Props) {
  const classRoot = cn('', className)

  return (
    <BorderBlock className={classRoot}>
      <div>Available to Claim</div>
      <Balance className="mt-5" currency="EDU" value={'0.1'} withCoin={false} />
      <ActionButton className="mt-6" />
      <div className="mt-5">EDU will be delivered to your wallet in in 1D 22H 23M</div>
    </BorderBlock>
  )
}
