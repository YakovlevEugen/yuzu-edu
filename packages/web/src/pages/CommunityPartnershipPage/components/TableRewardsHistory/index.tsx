import { useMemo } from 'react';

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
import { cn } from '@/helpers/lib';
import { useCommunityRewardsHistory } from '@/hooks/api';
import type { ICommunityCampaignItems } from '@/types/wallet';

interface Props {
  className?: string;
}

export default function TableRewardsHistory({ className }: Props) {
  const rewardsHistoryQuery = useCommunityRewardsHistory();

  const classRoot = cn('', className);

  const rewardsHistory = useMemo<ICommunityCampaignItems>(
    () =>
      (rewardsHistoryQuery.data?.pages.flat() as ICommunityCampaignItems)?.map(
        (item) => ({
          ...item,
          points: formatBigNumber(item.points)
        })
      ) || [],
    [rewardsHistoryQuery]
  );

  return (
    <Table className={classRoot}>
      <TableHeader>
        <TableRow>
          <TableHead>Community</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">You Earned</TableHead>
        </TableRow>
      </TableHeader>

      {rewardsHistory?.length > 0 && (
        <TableBody>
          {rewardsHistory.map(
            ({ community, points, type = 'Testnet farming' }, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: don't have uniq id and indexes won't change
              <TableRow key={index}>
                <TableCell>{community}</TableCell>
                <TableCell>{type}</TableCell>
                <TableCell className="text-right">{points} Yuzu</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      )}

      <TableFooter>
        <TableRow>
          <TableCell
            className="text-center"
            colSpan={
              (rewardsHistory?.[0] && Object.keys(rewardsHistory[0])?.length) ??
              3
            }
          >
            {rewardsHistory?.length > 0 ? (
              <Button
                variant="link"
                onClick={() => rewardsHistoryQuery.fetchNextPage()}
                disabled={
                  !rewardsHistoryQuery.hasNextPage ||
                  rewardsHistoryQuery.isFetching
                }
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
