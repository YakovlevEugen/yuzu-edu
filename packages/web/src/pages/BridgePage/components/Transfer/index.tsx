import { useMemo, useState } from 'react'
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
import TransferTabs, { TTransferTabId } from './components/TransferTabs'

import { CURRENCY_TITLE } from '@/constants/currencies'
import { cn } from '@/helpers/lib'
import { formatBigWithComas } from '@/helpers/format'
import { useBalance } from '@/hooks/api'

export const FormSchema = z.object({
  currency: z.string(),
  topUp: z.string()
})
export type FormSchema = z.infer<typeof FormSchema>

interface Props {
  className?: string
}

const BLOCK_PADDING = 'py-6 px-6 md:px-8'

export default function Transfer({ className }: Props) {
  const balance = useBalance()
  const formMethods = useForm<FormSchema>({
    defaultValues: {
      currency: '',
      topUp: ''
    },
    resolver: zodResolver(FormSchema)
  })
  const { control, watch } = formMethods

  const classRoot = cn('', className)
  const [, setTabId] = useState<TTransferTabId>('deposit')
  const topUp: FormSchema['topUp'] = watch('topUp')
  const currency = watch('currency')

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

  function handleTabChange(value: TTransferTabId) {
    setTabId(value)
  }

  return (
    <FormProvider {...formMethods}>
      <BorderBlock className={classRoot} variant="yellow" padding="none">
        <div>
          <div className={BLOCK_PADDING}>
            <TransferTabs onChange={handleTabChange} />

            <TransformFromTo className="mt-4" from="arb" to="edu" />

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
                name="topUp"
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
            {Boolean(topUp) && Boolean(currency) && (
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
