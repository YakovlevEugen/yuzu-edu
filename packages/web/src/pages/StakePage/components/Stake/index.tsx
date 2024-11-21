import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import BorderBlock from '@/components/BorderBlock'
import CurrencyInput from '@/components/CurrencyInput'
import InfoItem from '@/components/InfoItem'
import TransformCurrency from '@/components/TransformCurrency'
import ActionButton from './components/ActionButton'

import { cn } from '@/helpers/lib'
import { formatNumberWithCommas } from '@/helpers/format'

export const FormSchema = z.object({
  topUp: z.string().optional()
})
export type FormSchema = z.infer<typeof FormSchema>

interface Props {
  className?: string
}

const BLOCK_PADDING = 'py-6 px-6 md:px-8'

export default function Stake({ className }: Props) {
  const formMethods = useForm<FormSchema>({
    defaultValues: {
      topUp: ''
    },
    resolver: zodResolver(FormSchema)
  })
  const { control, watch } = formMethods

  const classRoot = cn('', className)

  const topUp: FormSchema['topUp'] = watch('topUp')

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
                  <span className="text-foreground">{formatNumberWithCommas('100000')} EDU</span>
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
                <InfoItem
                  className="mb-6 mt-10px"
                  title="Est. 24h Yuzu"
                  value={<TransformCurrency className="font-medium" to="500" />}
                />
              </>
            )}
            <ActionButton />
          </div>
        </div>
      </BorderBlock>
    </FormProvider>
  )
}
