import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import BorderBlock from '@/components/BorderBlock'
import CurrencyInput from '@/components/CurrencyInput'
import InfoItem from '@/components/InfoItem'
import TransformCurrency from '@/components/TransformCurrency'
import ActionButton from './components/ActionButton'

import { cn } from '@/helpers/lib'
import { formatBigWithComas } from '@/helpers/format'
import { useBalance, useStakeBalance, useStakeEstimate } from '@/hooks/api'
import { useMemo } from 'react'

export const FormSchema = z.object({
  topUp: z.string().optional()
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
      topUp: ''
    },
    resolver: zodResolver(FormSchema)
  })
  const { control, watch } = formMethods

  const classRoot = cn('', className)
  const topUp: FormSchema['topUp'] = watch('topUp')

  const amount = useMemo(() => {
    const balance = parseFloat(stakeBalance.data || '0')
    const increase = parseFloat(topUp || '0') * 1e18
    return (balance + increase).toString()
  }, [stakeBalance.data, topUp])

  const estimate = useStakeEstimate(amount)

  return (
    <FormProvider {...formMethods}>
      <BorderBlock className={classRoot} variant="yellow" padding="none">
        <div>
          <div className={BLOCK_PADDING}>
            <InfoItem
              title={<span className="fs-14">Available to Stake</span>}
              value={
                <>
                  <span>MAX </span>
                  <span className="text-foreground">{formatBigWithComas(balance.data)} EDU</span>
                </>
              }
            />
            <div>
              <Controller name="topUp" control={control} render={({ field }) => <CurrencyInput {...field} />} />
            </div>
          </div>

          <div className={cn(BLOCK_PADDING, 'bg-foreground text-white')}>
            {topUp && (
              <>
                <div className="mb-5px text-sm">Total EDU Staked</div>
                <TransformCurrency currency="EDU" size="l" to={topUp} variant="greenLight" />
                {balance.data && estimate.data && (
                  <InfoItem
                    className="mb-6 mt-10px"
                    title="Est. 24h Yuzu"
                    value={
                      <TransformCurrency className="font-medium" from={balance.data} to={estimate.data.toString()} />
                    }
                  />
                )}
              </>
            )}
            <ActionButton />
          </div>
        </div>
      </BorderBlock>
    </FormProvider>
  )
}
