import type { Meta, StoryObj } from '@storybook/react'

import TransformCurrency from './index'

const meta: Meta<typeof TransformCurrency> = {
  component: TransformCurrency,
  tags: ['autodocs'],
  argTypes: {
    from: {
      control: 'text'
    },
    to: {
      control: 'text'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: null
  }
}
