import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'ui/dropdown-menu'
import SvgIcon from '@/components/SvgIcon'

import { cn } from '@/helpers/lib'
import { replaceCenterWithEllipsis } from '@/helpers/text'
import { useAccount, useDisconnect } from 'wagmi'

export interface Props {
  className?: string
}

export default function WalletMenu({ className }: Props) {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  const classRoot = cn('', className)

  const shortenWalletNumber = replaceCenterWithEllipsis(address, 5)

  return (
    <DropdownMenu className={classRoot}>
      <DropdownMenuTrigger className="flex items-center outline-none">
        <span className="font-semibold text-orange">{shortenWalletNumber || 'Undefined'}</span>
        <SvgIcon className="ml-3 text-gray" name="arrow-down" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnect}>Exit</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
