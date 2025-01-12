import Balance from '@/components/Balance';
import BorderBlock from '@/components/BorderBlock';
import ActionButton from './components/ActionButton';

import { CaptchaProvider } from '@/components/CaptchaProvider';
import WalletConnectFilter from '@/containers/WalletConnectFilter';
import { cn } from '@/helpers/lib';
import { useClaimEligilibity } from '@/hooks/api';

interface Props {
  className?: string;
}

export default function Claim({ className }: Props) {
  const classRoot = cn('', className);
  const eligibility = useClaimEligilibity();

  return (
    <CaptchaProvider>
      <BorderBlock className={classRoot}>
        <WalletConnectFilter>
          {eligibility.isFetching ? (
            <>Checking Eligibility</>
          ) : eligibility.data === 'eligible' ? (
            <>
              <div>Available to Claim</div>
              <Balance
                className="mt-5"
                currency="EDU"
                value={'0.1'}
                withCoin={false}
              />

              <ActionButton
                className="mt-6"
                eligibility={eligibility.data || 'eligible'}
                refresh={() => eligibility.refetch()}
              />

              <div className="mt-5">
                EDU will be delivered to your wallet in 5 seconds
              </div>
            </>
          ) : (
            <>
              {eligibility.data === 'claimed'
                ? 'Already Claimed'
                : 'Ineligible'}
            </>
          )}
        </WalletConnectFilter>
      </BorderBlock>
    </CaptchaProvider>
  );
}
