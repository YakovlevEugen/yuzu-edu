import BorderBlock from '@/components/BorderBlock';
import CurrencyInput from '@/components/CurrencyInput';
import InfoItem from '@/components/InfoItem';
import TransformCurrency from '@/components/TransformCurrency';

import { isNumberish } from '@/helpers/common';
import { cn } from '@/helpers/lib';
import { useStakingEstimate, useTokenBalance } from '@/hooks/api';
import { useChainId } from '@/hooks/use-chain-id';
import { zodResolver } from '@hookform/resolvers/zod';
import Big from 'big.js';
import { useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import ActionButton from './components/ActionButton';
import StakeTabs from './components/StakeTabs';
import { DEFAULT_ACTIVE_TAB, TABS } from './components/StakeTabs/constants';

export const FormSchema = z.object({
  activeTabId: z.string(),
  amount: z.string()
});
export type FormSchema = z.infer<typeof FormSchema>;

interface Props {
  className?: string;
}

const BLOCK_PADDING = 'py-6 px-6 md:px-8';

export default function Stake({ className }: Props) {
  const chainId = useChainId();
  const eduBalance = useTokenBalance(chainId, 'edu');
  const weduBalance = useTokenBalance(chainId, 'wedu');

  const formMethods = useForm<FormSchema>({
    defaultValues: {
      activeTabId: DEFAULT_ACTIVE_TAB,
      amount: ''
    },
    resolver: zodResolver(FormSchema)
  });

  const { control, setValue, watch } = formMethods;
  const classRoot = cn('', className);
  const amount = watch('amount');
  const activeTabId = watch('activeTabId');

  const tabs = useMemo(() => {
    return TABS.map((tab) => {
      const weduBalanceBig = new Big(weduBalance.data);
      if (tab.id === 'unwrap' && weduBalanceBig.eq(0)) {
        return {
          ...tab,
          disabled: true
        };
      }

      return tab;
    });
  }, [weduBalance.data]);

  const total = useMemo(() => {
    if (isNumberish(amount)) {
      try {
        return new Big(weduBalance.data)
          .add(activeTabId === 'stake' ? amount : `-${amount}`)
          .toFixed(18);
      } catch (error) {
        console.warn(error);
        return '0';
      }
    }
    return '0';
  }, [activeTabId, amount, weduBalance]);

  const estimate = useStakingEstimate(
    activeTabId === 'stake' ? amount : `-${amount}`
  );

  return (
    <FormProvider {...formMethods}>
      <BorderBlock className={classRoot} variant="yellow" padding="none">
        <div>
          <div className={BLOCK_PADDING}>
            <Controller
              name="activeTabId"
              control={control}
              render={({ field }) => (
                <StakeTabs {...field} className="mb-4" tabs={tabs} />
              )}
            />

            <div>
              <InfoItem
                title={
                  <span className="fs-14">
                    Available to{' '}
                    {tabs.find(({ id }) => id === activeTabId)?.title}
                  </span>
                }
                value={
                  <button
                    type="button"
                    onClick={() =>
                      setValue(
                        'amount',
                        activeTabId === 'stake'
                          ? eduBalance.data
                          : weduBalance.data
                      )
                    }
                    className="hover:brightness-75 active:brightness-125"
                  >
                    <span>MAX </span>
                    <span className="text-foreground">
                      {activeTabId === 'stake'
                        ? `${eduBalance.data} EDU`
                        : `${weduBalance.data} WEDU`}
                    </span>
                  </button>
                }
              />
            </div>
            <div>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => <CurrencyInput {...field} />}
              />
            </div>
          </div>

          <div className={cn(BLOCK_PADDING, 'bg-foreground text-white')}>
            {isNumberish(amount) && (
              <>
                <div className="mb-5px text-sm">Total EDU Staked</div>
                <TransformCurrency
                  currency="EDU"
                  size="l"
                  from={weduBalance.data}
                  to={total}
                  variant="greenLight"
                />

                {Boolean(weduBalance.data) && Boolean(estimate.data) && (
                  <InfoItem
                    className="mt-10px"
                    title="Est. 24h Yuzu"
                    value={
                      <TransformCurrency
                        className="font-medium"
                        from={estimate.data.toString()}
                      />
                    }
                  />
                )}
              </>
            )}
            <ActionButton className="mt-6" />
          </div>
        </div>
      </BorderBlock>
    </FormProvider>
  );
}
