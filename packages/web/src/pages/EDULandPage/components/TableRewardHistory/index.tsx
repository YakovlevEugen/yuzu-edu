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

import { cn } from '@/helpers/lib';
// import { useBridgeHistory } from '@/hooks/api'
import { rewardsHistory } from '../../constants';

interface Props {
  className?: string;
}

export default function TableRewardHistory({ className }: Props) {
  const classRoot = cn('', className);

  // const query = useBridgeHistory()
  //
  // const data = useMemo<ICommunityCampaign[]>(
  //   () =>
  //     (query.data?.pages.flat() as ICommunityCampaign[])?.map((item) => ({
  //       ...item
  //     })) || [],
  //   [query]
  // )

  return (
    <Table className={classRoot}>
      <TableHeader>
        <TableRow>
          <TableHead>Community</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Points Distributed</TableHead>
          <TableHead className="text-right">You Earned</TableHead>
        </TableRow>
      </TableHeader>

      {rewardsHistory?.length > 0 && (
        <TableBody>
          {rewardsHistory.map(
            ({ community, points, pointsDistributed, type }) => (
              <TableRow key={community}>
                <TableCell>{community}</TableCell>
                <TableCell>{type}</TableCell>
                <TableCell>{pointsDistributed}</TableCell>
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
            colSpan={Object.keys(rewardsHistory?.[0]).length ?? 4}
          >
            {/*{rewardsHistory?.length > 0 ? (*/}
            {/*  <Button*/}
            {/*    variant="link"*/}
            {/*    onClick={() => query.fetchNextPage()}*/}
            {/*    disabled={!query.hasNextPage || query.isFetching}*/}
            {/*  >*/}
            {/*    Load More*/}
            {/*  </Button>*/}
            {/*) : (*/}
            {/*  <div>No Data</div>*/}
            {/*)}*/}
            <Button variant="link">Load More</Button>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
