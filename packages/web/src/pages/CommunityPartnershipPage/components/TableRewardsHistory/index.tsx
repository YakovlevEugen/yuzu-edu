import { useMemo } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from 'ui/table';

import { cn } from '@/helpers/lib';
import { useCommunityRewardsHistory } from '@/hooks/api';
import { Button } from 'ui/button';

interface Props {
  className?: string;
}

export default function TableRewardsHistory({ className }: Props) {
  const query = useCommunityRewardsHistory();

  const classRoot = cn('', className);

  const history = useMemo(() => query.data?.pages.flat() || [], [query]);
  const hasNextPage = useMemo(
    () => (query.data.pages.at(-1) || []).length > 0,
    [query]
  );

  return (
    <Table className={classRoot}>
      <TableHeader>
        <TableRow>
          <TableHead>Community</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">You Earned</TableHead>
        </TableRow>
      </TableHeader>

      {history.length > 0 && (
        <TableBody>
          {history.map(({ community, points, createdAt }) => (
            <TableRow key={`${community}-${createdAt}`}>
              <TableCell className="capitalize">{community}</TableCell>
              <TableCell className="capitalize">awarded</TableCell>
              <TableCell className="capitalize">
                {new Date(createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                {points.toLocaleString()} Yuzu
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}

      <TableFooter>
        <TableRow>
          <TableCell className="text-center" colSpan={4}>
            {hasNextPage ? (
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
