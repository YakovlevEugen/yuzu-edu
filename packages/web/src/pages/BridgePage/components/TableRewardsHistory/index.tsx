import { format } from 'date-fns';
// import { useMemo } from 'react'

import { Button } from 'ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from 'ui/table';

import { formatBigNumber } from '@/helpers/format';
// import { formatBigNumber } from '@/helpers/format'
import { cn } from '@/helpers/lib';
import { useBridgeHistory } from '@/hooks/api';
import type { IBridgeReward } from '@/types/wallet';
import { useMemo } from 'react';

interface Props {
  className?: string;
}

// const data: IBridgeReward[] = new Array(10).fill({
//   timestamp: '2024-09-24T20:58:43Z',
//   amount: '1000',
//   points: '1000'
// })

export default function TableRewardsHistory({ className }: Props) {
  const classRoot = cn('', className);

  const query = useBridgeHistory();

  const data = useMemo<IBridgeReward[]>(
    () =>
      (query.data?.pages.flat() as IBridgeReward[])?.map((item) => ({
        ...item,
        amount: formatBigNumber(item.amount)
      })) || [],
    [query]
  );

  return (
    <Table className={classRoot}>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Bridged Amount</TableHead>
          <TableHead className="text-right">You Earned</TableHead>
        </TableRow>
      </TableHeader>

      {data?.length > 0 && (
        <TableBody>
          {data.map(({ amount, points, timestamp }) => (
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
            {data?.length > 0 ? (
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
  );
}
