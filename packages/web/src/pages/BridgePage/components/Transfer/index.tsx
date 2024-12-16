import { useMemo } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import BorderBlock from '@/components/BorderBlock'
import CurrencyInput from '@/components/CurrencyInput'
import CurrencySelect from '@/components/CurrencySelect'
import InfoItem, { Props as PropsInfoItem } from '@/components/InfoItem'
import TransformCurrency from '@/components/TransformCurrency'
import TransformFromTo from '@/components/TransformFromTo'
import ActionButton from './components/ActionButton'
import TransferTabs from './components/TransferTabs'

import { CURRENCY_TITLE } from '@/constants/currencies'
import { formatBigWithComas } from '@/helpers/format'
import { cn } from '@/helpers/lib'
import { useBalance } from '@/hooks/api'
import { TTokens } from '@/types/common'
import { DEFAULT_ACTIVE_TAB } from './components/TransferTabs/constants'

export const FormSchema = z.object({
  activeTabId: z.string(),
  amount: z.string(),
  currency: z.string()
})
export type FormSchema = z.infer<typeof FormSchema>

interface ITransferCurrencies {
  from: TTokens
  to: TTokens
}

interface Props {
  className?: string
}

const BLOCK_PADDING = 'py-6 px-6 md:px-8'

const DEFAULT_TRANSFER_CYRRENCY_FROM = 'arb'

export default function Transfer({ className }: Props) {
  const balance = useBalance()
  const formMethods = useForm<FormSchema>({
    defaultValues: {
      activeTabId: DEFAULT_ACTIVE_TAB,
      amount: '',
      currency: 'edu'
    },
    resolver: zodResolver(FormSchema)
  })
  const { control, watch } = formMethods

  const classRoot = cn('', className)
  const activeTabId: FormSchema['activeTabId'] = watch('activeTabId')
  const currency: FormSchema['currency'] = watch('currency')
  const amount: FormSchema['amount'] = watch('amount')

  const transferCurrencies = useMemo<ITransferCurrencies>(
    () =>
      activeTabId === 'deposit'
        ? {
            from: DEFAULT_TRANSFER_CYRRENCY_FROM,
            to: currency as TTokens
          }
        : {
            from: currency as TTokens,
            to: DEFAULT_TRANSFER_CYRRENCY_FROM
          },
    [activeTabId, currency]
  )

  const infoItems = useMemo<PropsInfoItem[]>(
    () => [
      {
        title: 'To',
        value: CURRENCY_TITLE?.['edu'],
        variant: 'white'
      },
      {
        title: 'Receive',
        value: <TransformCurrency className="font-medium" currency="EDU" from="500" />
      },
      {
        title: 'Transfer time',
        value: `${format(12312312, 'm')} min`,
        variant: 'white'
      },
      {
        title: 'Estimated fees',
        value: <TransformCurrency className="font-medium" currency="EDU" from="0.1" />
      }
    ],
    []
  )

  return (
    <FormProvider {...formMethods}>
      <BorderBlock className={classRoot} variant="yellow" padding="none">
        <div>
          <div className={BLOCK_PADDING}>
            <Controller
              name="activeTabId"
              control={control}
              render={({ field }) => <TransferTabs {...field} className="mb-4" />}
            />

            <TransformFromTo from={transferCurrencies.from} to={transferCurrencies.to} />

            <InfoItem
              className="mt-4"
              title={<span className="fs-14">Available to Bridge</span>}
              value={
                <>
                  <span>MAX </span>
                  <span className="text-foreground">{formatBigWithComas(balance.data)} EDU</span>
                </>
              }
            />
            <div>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    {...field}
                    currency={
                      <Controller
                        name="currency"
                        control={control}
                        render={({ field: currencyField }) => <CurrencySelect {...currencyField} />}
                      />
                    }
                  />
                )}
              />
            </div>
          </div>

          <div className={cn(BLOCK_PADDING, 'bg-foreground text-white')}>
            {Boolean(amount) && Boolean(currency) && (
              <div className="mb-6">
                {infoItems.map((item) => (
                  <InfoItem className="mt-3" {...item} />
                ))}
              </div>
            )}
            <ActionButton />
          </div>
        </div>
      </BorderBlock>
    </FormProvider>
  )
}
