import type { Meta, StoryObj } from '@storybook/react'

import ConnectWalletButton from './index'

const meta: Meta<typeof ConnectWalletButton> = {
  component: ConnectWalletButton,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
