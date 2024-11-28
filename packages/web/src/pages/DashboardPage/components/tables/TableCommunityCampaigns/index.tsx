// import { useMemo } from 'react'

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from 'ui/table'
import { Button } from 'ui/button'

import { cn } from '@/helpers/lib'
// import { useBridgeHistory } from '@/hooks/api'
import { ICommunityCampaign } from '@/types/wallet'

interface Props {
  className?: string
}

const data: ICommunityCampaign[] = new Array(15).fill({
  community: 'Community 1',
  points: '1000',
  type: 'Testnet farming'
})

export default function TableCommunityCampaigns({ className }: Props) {
  const classRoot = cn('', className)

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
          <TableHead className="text-right">You Earned</TableHead>
        </TableRow>
      </TableHeader>

      {data?.length > 0 && (
        <TableBody>
          {data.map(({ community, points, type }) => (
            <TableRow key={community}>
              <TableCell>{community}</TableCell>
              <TableCell>{type}</TableCell>
              <TableCell className="text-right">{points} Yuzu</TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}

      <TableFooter>
        <TableRow>
          <TableCell className="text-center" colSpan={3}>
            {/*{data?.length > 0 ? (*/}
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
  )
}
