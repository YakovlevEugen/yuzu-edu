import type { Meta, StoryObj } from '@storybook/react'

import WalletConnect from './index'

const meta: Meta<typeof WalletConnect> = {
  component: WalletConnect,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
