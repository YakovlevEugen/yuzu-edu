import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import type { Meta, StoryObj } from '@storybook/react'

import ActionButton from './index'

import { FormSchema } from '@/pages/StakePage/components/Stake'

const meta: Meta<typeof ActionButton> = {
  component: (props) => {
    const formMethods = useForm<FormSchema>({
      defaultValues: {
        topUp: ''
      },
      resolver: zodResolver(FormSchema)
    })

    return (
      <FormProvider {...formMethods}>
        <ActionButton {...props} />
      </FormProvider>
    )
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
