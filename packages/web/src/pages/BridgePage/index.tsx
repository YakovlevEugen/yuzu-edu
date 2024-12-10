import BorderBlock from '@/components/BorderBlock'
import TableRewardsHistory from '@/pages/BridgePage/components/TableRewardsHistory'
import Earn from './components/Earn'
import Transfer from './components/Transfer'

export default function BridgePage() {
  return (
    <div>
      <div className="text-center text-4xl font-bold tracking-tighter md:text-6xl">
        Bridge to <span className="text-green-light">EDUChain</span>
      </div>

      <div className="flex flex-col gap-x-6 md:flex-row">
        <div className="flex-[1]">
          <img
            className="relative z-[1] mx-auto h-[170px] md:h-[230px]"
            src="/images/capybara-exchanger.svg"
            alt="Capybara Exchanger"
          />
          <Earn />
        </div>

        <div className="flex-[1] pt-0 md:pt-[115px]">
          <Transfer />
        </div>
      </div>

      <BorderBlock className="mt-10 !px-4 !py-6 shadow-none" padding="none">
        <div className="ml-2 font-semibold">Reward History</div>
        <TableRewardsHistory className="mt-4" />
      </BorderBlock>
    </div>
  )
}
