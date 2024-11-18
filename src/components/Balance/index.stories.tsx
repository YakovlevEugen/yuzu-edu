import type { Meta, StoryObj } from '@storybook/react'

import Balance from './index'

const meta: Meta<typeof Balance> = {
  component: Balance,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'text' }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
