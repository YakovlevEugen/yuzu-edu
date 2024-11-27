import { format } from 'date-fns'
import { useMemo } from 'react'

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from 'ui/button'

import { cn } from '@/helpers/lib'
import { useBridgeHistory } from '@/hooks/api'
import { BridgeReward } from '@/types/wallet'
import { formatBigNumber } from '@/helpers/format'

interface Props {
  className?: string
}

// const bridgeRewards: BridgeReward[] = new Array(15).fill({
//   date: '2024-09-24T20:58:43Z',
//   bridgedAmount: '1000',
//   earnedAmount: '1000'
// })

export default function HistoryTable({ className }: Props) {
  const classRoot = cn('', className)

  const query = useBridgeHistory()

  const bridgeRewards = useMemo<BridgeReward[]>(
    () =>
      (query.data?.pages.flat() as BridgeReward[])?.map((item) => ({
        ...item,
        amount: formatBigNumber(item.amount)
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

      {bridgeRewards?.length > 0 && (
        <TableBody>
          {bridgeRewards.map(({ amount, points, timestamp }) => (
            <TableRow key={timestamp}>
              <TableCell>{format(timestamp, 'do MMM uuuu')}</TableCell>
              <TableCell>{amount} EDU</TableCell>
              <TableCell className="text-right">{points} Yuzu</TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}

      <TableFooter>
        <TableRow>
          <TableCell className="text-center" colSpan={3}>
            {bridgeRewards?.length > 0 ? (
              <Button
                variant="link"
                onClick={() => query.fetchNextPage()}
                disabled={!query.hasNextPage || query.isFetching}
              >
                Load More
              </Button>
            ) : (
              <div>No Data</div>
            )}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
