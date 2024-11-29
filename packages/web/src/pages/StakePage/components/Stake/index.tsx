import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { z } from 'zod'

import BorderBlock from '@/components/BorderBlock'
import CurrencyInput from '@/components/CurrencyInput'
import InfoItem from '@/components/InfoItem'
import TransformCurrency from '@/components/TransformCurrency'
import ActionButton from './components/ActionButton'
import StakeTabs from './components/StakeTabs'

import { formatBigWithComas } from '@/helpers/format'
import { cn } from '@/helpers/lib'
import { useBalance, useStakeBalance, useStakeEstimate } from '@/hooks/api'
import { DEFAULT_ACTIVE_TAB } from './components/StakeTabs/constants'

export const FormSchema = z.object({
  activeTabId: z.string(),
  amount: z.string()
})
export type FormSchema = z.infer<typeof FormSchema>

interface Props {
  className?: string
}

const BLOCK_PADDING = 'py-6 px-6 md:px-8'

export default function Stake({ className }: Props) {
  const balance = useBalance()
  const stakeBalance = useStakeBalance()
  const formMethods = useForm<FormSchema>({
    defaultValues: {
      activeTabId: DEFAULT_ACTIVE_TAB,
      amount: ''
    },
    resolver: zodResolver(FormSchema)
  })
  const { control, watch } = formMethods

  const classRoot = cn('', className)
  const amount: FormSchema['amount'] = watch('amount')

  const resultAmount = useMemo(() => {
    const balance = parseFloat(stakeBalance.data || '0')
    const increase = parseFloat(amount || '0') * 1e18
    return (balance + increase).toString()
  }, [stakeBalance.data, amount])

  const estimate = useStakeEstimate(resultAmount)

  return (
    <FormProvider {...formMethods}>
      <BorderBlock className={classRoot} variant="yellow" padding="none">
        <div>
          <div className={BLOCK_PADDING}>
            <Controller
              name="activeTabId"
              control={control}
              render={({ field }) => <StakeTabs {...field} className="mb-4" />}
            />

            <div>
              <InfoItem
                title={<span className="fs-14">Available to Stake</span>}
                value={
                  <>
                    <span>MAX </span>
                    <span className="text-foreground">{formatBigWithComas(balance.data)} EDU</span>
                  </>
                }
              />
            </div>
            <div>
              <Controller name="amount" control={control} render={({ field }) => <CurrencyInput {...field} />} />
            </div>
          </div>

          <div className={cn(BLOCK_PADDING, 'bg-foreground text-white')}>
            {Boolean(amount) && (
              <>
                <div className="mb-5px text-sm">Total EDU Staked</div>
                <TransformCurrency currency="EDU" size="l" to={amount} variant="greenLight" />
                {Boolean(balance.data) && Boolean(estimate.data) && (
                  <InfoItem
                    className="mt-10px"
                    title="Est. 24h Yuzu"
                    value={<TransformCurrency className="font-medium" from={estimate.data} />}
                  />
                )}
              </>
            )}
            <ActionButton className="mt-6" />
          </div>
        </div>
      </BorderBlock>
    </FormProvider>
  )
}
