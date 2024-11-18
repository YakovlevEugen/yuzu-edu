import type { Meta, StoryObj } from '@storybook/react'

import Stake from './index'

const meta: Meta<typeof Stake> = {
  component: Stake,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
