import type { Meta, StoryObj } from '@storybook/react'

import EDUFaucetPage from './index'

const meta: Meta<typeof EDUFaucetPage> = {
  component: EDUFaucetPage,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
