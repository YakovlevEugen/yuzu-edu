import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'ui/dropdown-menu'
import SvgIcon from '@/components/SvgIcon'

import { useWallet } from '@/providers/wallet/hook'
import { cn } from '@/helpers/lib'
import { replaceCenterWithEllipsis } from '@/helpers/text'

export interface Props {
  className?: string
}

export default function WalletMenu({ className }: Props) {
  const { wallet } = useWallet()
  const classRoot = cn('', className)

  const shortenWalletNumber = replaceCenterWithEllipsis(wallet?.id, 5)

  return (
    <DropdownMenu className={classRoot}>
      <DropdownMenuTrigger className="flex items-center outline-none">
        <span className="font-semibold text-orange">{shortenWalletNumber || 'Undefined'}</span>
        <SvgIcon className="ml-3 text-gray" name="arrow-down" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Change Wallet</DropdownMenuItem>
        <DropdownMenuItem>Operations</DropdownMenuItem>
        <DropdownMenuItem>Exit</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
