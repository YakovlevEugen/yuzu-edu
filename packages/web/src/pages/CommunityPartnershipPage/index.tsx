import { useMemo } from 'react';
import { useAccount } from 'wagmi';

import Balance from '@/components/Balance';
import BorderBlock from '@/components/BorderBlock';
import CommunityBalance from './components/CommunityBalance';
// import TableRewardHistory from './components/TableRewardHistory';

import { cn } from '@/helpers/lib';
import type {
  ICommunityCampaignItem,
  TCommunityCampaignItemKeys
} from '@/types/wallet';
import rewardsHistoryCsv from './community-campaigns.csv?raw';

interface Props {
  className?: string;
}

export default function CommunityPartnership({ className }: Props) {
  const { address } = useAccount();

  const classRoot = cn('pb-10', className);

  const rewardsHistory = useMemo<ICommunityCampaignItem[]>(() => {
    const [headersRow, ...rows] = rewardsHistoryCsv
      .split('\n')
      .map((row) => row.trim());
    const headers: TCommunityCampaignItemKeys[] = headersRow
      .split(',')
      .map((h) => h.trim().toLowerCase() as TCommunityCampaignItemKeys);

    return rows.map((row) => {
      const values = row.split(',').map((v) => v.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index] || '';
        return obj;
      }, {} as ICommunityCampaignItem);
    }) as ICommunityCampaignItem[];
  }, []);

  const rewardsByCommunity = useMemo(
    () =>
      rewardsHistory.reduce(
        (acc, { community, points }) => {
          if (acc?.[community]) {
            acc[community] += Number(points);
          } else {
            acc[community] = Number(points);
          }

          return acc;
        },
        {} as Record<string, number>
      ),
    [rewardsHistory]
  );

  const userRewardsSum = useMemo(
    () =>
      rewardsHistory.reduce(
        (acc, { wallet, points }) =>
          wallet === address ? acc + Number(points) : acc,
        0
      ),
    [address, rewardsHistory]
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
          <Balance className="mt-5 justify-center" value={userRewardsSum} />
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

        {/*<BorderBlock className="mt-5 w-full">*/}
        {/*  <h3 className="mb-5 ml-2 font-semibold">Reward History</h3>*/}
        {/*  <TableRewardHistory />*/}
        {/*</BorderBlock>*/}
      </div>
    </div>
  );
}
