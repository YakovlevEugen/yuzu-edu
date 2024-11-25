import { format } from 'date-fns'

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from 'ui/button'

import { cn } from '@/helpers/lib'
import { useBridgeHistory } from '@/hooks/api'
import { BridgeReward } from '@/types/wallet'
import { useMemo } from 'react'

interface Props {
  className?: string
}

// const bridgeRewards: BridgeReward[] = new Array(15).fill({
//   date: '2024-09-24T20:58:43Z',
//   bridgedAmount: '1000',
//   earnedAmount: '1000'
// })

import { Big } from 'big.js'

export default function HistoryTable({ className }: Props) {
  const classRoot = cn('', className)

  const query = useBridgeHistory()

  const bridgeRewards = useMemo<BridgeReward[]>(
    () =>
      query.data?.pages.flat().map((item) => ({
        date: item.timestamp,
        bridgedAmount: new Big(item.amount).div(1e18).toFixed(2),
        earnedAmount: item.points
      })) || [],
    [query]
  )

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
            <Button
              variant="link"
              onClick={() => query.fetchNextPage()}
              disabled={!query.hasNextPage || query.isFetching}
            >
              Load More
            </Button>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
