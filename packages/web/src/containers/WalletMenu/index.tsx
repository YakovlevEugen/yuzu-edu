import posthog from 'posthog-js';
import { useAccount, useDisconnect } from 'wagmi';

import SvgIcon from '@/components/SvgIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'ui/dropdown-menu';

import { replaceCenterWithEllipsis } from '@/helpers/text';

export default function WalletMenu() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect({
    onSuccess(data) {
      console.log('Wallet disconnected:', data);
      posthog?.capture('Wallet disconnected:' + data);
    }
  });

  const shortenWalletNumber = address
    ? replaceCenterWithEllipsis(address, 5)
    : '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center outline-none">
        <span className="font-semibold text-orange">
          {shortenWalletNumber || 'Undefined'}
        </span>
        <SvgIcon className="ml-3 text-gray" name="arrow-down" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => disconnect()}>Exit</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
