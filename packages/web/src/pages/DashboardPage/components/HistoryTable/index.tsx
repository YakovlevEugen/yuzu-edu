import { format } from 'date-fns'

import { Button } from 'ui/button'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { cn } from '@/helpers/lib'
import { BridgeReward } from '@/types/wallet'

interface Props {
  className?: string
}

const bridgeRewards: BridgeReward[] = new Array(15).fill({
  date: '2024-09-24T20:58:43Z',
  bridgedAmount: '1000',
  earnedAmount: '1000'
})

export default function HistoryTable({ className }: Props) {
  const classRoot = cn('', className)

  return (
    <Table className={classRoot}>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Bridged Amount</TableHead>
          <TableHead className="text-right">You Earned</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bridgeRewards.map(({ date, bridgedAmount, earnedAmount }) => (
          <TableRow key={date}>
            <TableCell>{format(date, 'do MMM uuuu')}</TableCell>
            <TableCell>{bridgedAmount} EDU</TableCell>
            <TableCell className="text-right">{earnedAmount} Yuzu</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="text-center" colSpan={3}>
            <Button variant="link">Load More</Button>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
