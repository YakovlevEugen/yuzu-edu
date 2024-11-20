import type { Meta, StoryObj } from '@storybook/react'

import WalletConnectOptions from './index'

const meta: Meta<typeof WalletConnectOptions> = {
  component: WalletConnectOptions,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
