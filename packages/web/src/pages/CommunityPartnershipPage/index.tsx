import Balance from '@/components/Balance';
import BorderBlock from '@/components/BorderBlock';
import WalletConnectFilter from '@/containers/WalletConnectFilter';
import { cn } from '@/helpers/lib';
import {
  useCommunityRewards,
  useCommunityRewardsByAddress,
  useCommunityRewardsHistory
} from '@/hooks/api';
import { useMemo } from 'react';
import CommunityBalance from './components/CommunityBalance';
import TableRewardsHistory from './components/TableRewardsHistory';

interface Props {
  className?: string;
}

export default function CommunityPartnership({ className }: Props) {
  const allRewards = useCommunityRewards();
  const myRewards = useCommunityRewardsByAddress();
  const history = useCommunityRewardsHistory();

  const classRoot = cn('pb-10', className);

  const numHistoryEntries = useMemo(
    () => history.data.pages.flat().length,
    [history]
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
          <WalletConnectFilter triggerClass="!block mx-auto mt-5">
            <Balance className="mt-5 justify-center" value={myRewards.data} />
          </WalletConnectFilter>
        </BorderBlock>

        {numHistoryEntries > 0 ? (
          <BorderBlock className="mt-5 w-full">
            <h3 className="mb-5 ml-2 font-semibold">Rewards History</h3>
            <TableRewardsHistory />
          </BorderBlock>
        ) : (
          <></>
        )}

        <div className="mt-[55px] flex w-full columns-3 flex-wrap gap-x-2 gap-y-3">
          {allRewards.data.map(({ community, total }) => (
            <CommunityBalance
              key={community}
              className="flex-[1_0_calc(33.333%-8px)]"
              balance={total}
              title={community}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
