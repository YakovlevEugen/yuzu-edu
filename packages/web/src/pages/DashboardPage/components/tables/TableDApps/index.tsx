// import { useMemo } from 'react'

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from 'ui/table'
import { Button } from 'ui/button'
import DAppCard from '@/containers/DAppCard'

import { cn } from '@/helpers/lib'
// import { useBridgeHistory } from '@/hooks/api'
import { IDApp } from '@/types/wallet'

interface Props {
  className?: string
}

const data: IDApp[] = new Array(15).fill({
  avatarUrl: '/images/user-avatar.jpg',
  dAppName: 'Gangster Arena',
  points: '1000',
  type: 'NFTs/Gaming',
  userNick: '@gangsterarena'
})

export default function TableDApps({ className }: Props) {
  const classRoot = cn('', className)

  // const query = useBridgeHistory()
  //
  // const data = useMemo<IDApp[]>(
  //   () =>
  //     (query.data?.pages.flat() as IDApp[])?.map((item) => ({
  //       ...item
  //     })) || [],
  //   [query]
  // )

  return (
    <Table className={classRoot}>
      <TableHeader>
        <TableRow>
          <TableHead>DApp</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">You Earned</TableHead>
        </TableRow>
      </TableHeader>

      {data?.length > 0 && (
        <TableBody>
          {data.map(({ points, type, ...dAppCard }) => (
            <TableRow key={dAppCard.userNick + points}>
              <TableCell>
                <DAppCard {...dAppCard} />
              </TableCell>
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
