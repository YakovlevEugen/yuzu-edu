import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import BorderBlock from '@/components/BorderBlock';
import CurrencyInput from '@/components/CurrencyInput';
import CurrencySelect from '@/components/CurrencySelect';
import InfoItem from '@/components/InfoItem';
import TransformCurrency from '@/components/TransformCurrency';
import ActionButton from './components/ActionButton';
import TransferTabs from './components/TransferTabs';

import TransformFromTo from '@/components/TransformFromTo';
import { type IBlockchain, blockchains, tokens } from '@/constants/currencies';
import { cn } from '@/helpers/lib';
import { useTokenBalance } from '@/hooks/api';
import { TABS } from './components/TransferTabs/constants';

export const FormSchema = z.object({
  intent: z.enum([TABS[0].id, TABS[1].id]),
  amount: z.string(),
  token: z.enum(['edu', 'weth', 'usdc', 'usdt'])
});

export type FormSchema = z.infer<typeof FormSchema>;

export default function Transfer({ className }: { className?: string }) {
  const formMethods = useForm<FormSchema>({
    defaultValues: {
      intent: TABS[0].id,
      amount: '',
      token: 'edu'
    },
    resolver: zodResolver(FormSchema)
  });
  const { control, setValue, watch } = formMethods;

  const amount: FormSchema['amount'] = watch('amount');
  const intent: FormSchema['intent'] = watch('intent');
  const token: FormSchema['token'] = watch('token');

  const sourceChainId = useMemo(
    () => (intent === 'deposit' ? 'arbMainnet' : 'eduMainnet'),
    [intent]
  );
  const sourceTokenBalance = useTokenBalance(sourceChainId, token);

  // const targetChainId = useMemo(() => (intent === 'deposit' ? 'eduMainnet' : 'arbMainnet'), [intent])
  // const targetTokenBalance = useTokenBalance(targetChainId, token)

  const from: IBlockchain = useMemo(
    () => (intent === 'deposit' ? 'arb' : 'edu'),
    [intent]
  );
  const to: IBlockchain = useMemo(
    () => (intent === 'deposit' ? 'edu' : 'arb'),
    [intent]
  );

  return (
    <FormProvider {...formMethods}>
      <BorderBlock className={cn(className)} variant="yellow" padding="none">
        <div>
          <div className="px-6 py-6 md:px-8">
            <Controller
              name="intent"
              control={control}
              render={({ field }) => (
                <TransferTabs {...field} className="mb-4" />
              )}
            />

            <TransformFromTo from={from} to={to} />

            <button
              type="button"
              className="block w-full"
              onClick={() => setValue('amount', sourceTokenBalance.data)}
            >
              <InfoItem
                className="mt-4"
                title={<span className="fs-14">Available to Bridge</span>}
                value={
                  <>
                    <span>MAX </span>
                    <span className="text-foreground">
                      {Number.parseFloat(
                        sourceTokenBalance.data
                      ).toLocaleString()}{' '}
                      {tokens[token]}
                    </span>
                  </>
                }
              />
            </button>

            <div>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    {...field}
                    currency={() => (
                      <Controller
                        name="token"
                        control={control}
                        render={({ field: currencyField }) => (
                          <CurrencySelect {...currencyField} />
                        )}
                      />
                    )}
                  />
                )}
              />
            </div>
          </div>

          <div className="bg-foreground px-6 py-6 text-white md:px-8">
            {!!token && !!amount && (
              <div className="mb-6">
                <InfoItem
                  className="mt-3"
                  title="To"
                  value={blockchains[to]}
                  variant="white"
                />

                <InfoItem
                  className="mt-3"
                  title="Receive"
                  value={
                    <TransformCurrency
                      className="font-medium"
                      currency={tokens[token]}
                      from={amount}
                    />
                  }
                />

                <InfoItem
                  className="mt-3"
                  title="Transfer time"
                  value={intent === 'deposit' ? '~15 sec' : '~15 min'}
                  variant="white"
                />

                <InfoItem
                  className="mt-3"
                  title="Estimated fees"
                  value={
                    <TransformCurrency
                      className="font-medium"
                      currency="EDU"
                      from="0.1"
                    />
                  }
                />
              </div>
            )}
            <ActionButton />
          </div>
        </div>
      </BorderBlock>
    </FormProvider>
  );
}
