import { useMemo } from 'react';

import Balance from '@/components/Balance';
import BorderBlock from '@/components/BorderBlock';
import CommunityBalance from './components/CommunityBalance';
import TableRewardHistory from './components/TableRewardHistory';

import { cn } from '@/helpers/lib';
import { rewardsHistory } from './constants';

interface Props {
  className?: string;
}

export default function EDULandPage({ className }: Props) {
  const classRoot = cn('pb-10', className);

  const rewardsByCommunity = useMemo(
    () =>
      rewardsHistory.reduce(
        (acc, item) => {
          if (acc?.[item.community]) {
            acc[item.community] += Number(item.points);
          } else {
            acc[item.community] = Number(item.points);
          }

          return acc;
        },
        {} as Record<string, number>
      ),
    []
  );

  return (
    <div className={classRoot}>
      <div className="text-center text-4xl font-bold tracking-tighter text-white md:text-6xl">
        Community Partnerships
      </div>

      <div className="flex flex-col items-center">
        <div className="z-[1] -mb-[50px] mt-6">
          <img
            className="w-[218px] md:w-[327px]"
            src="/images/capybara-orange.svg"
            alt="Playing guitar capybara"
          />
        </div>

        <BorderBlock>
          <div className="mt-5 text-center">
            <span className="text-orange">Yuzu</span> earned from community
            partnerships
          </div>
          <Balance className="mt-5 justify-center" value={0.1} />
        </BorderBlock>

        <div className="mt-[55px] flex w-full columns-3 flex-wrap gap-x-2 gap-y-3">
          {Object.entries(rewardsByCommunity).map(([title, balance]) => (
            <CommunityBalance
              key={title}
              className="flex-[1_0_calc(33.333%-8px)]"
              balance={balance}
              title={title}
            />
          ))}
        </div>

        <BorderBlock className="mt-5 w-full">
          <h3 className="mb-5 ml-2 font-semibold">Reward History</h3>
          <TableRewardHistory />
        </BorderBlock>
      </div>
    </div>
  );
}
