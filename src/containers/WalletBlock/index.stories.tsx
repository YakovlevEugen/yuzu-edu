import type { Meta, StoryObj } from '@storybook/react'

import WalletBlock from './index'

const meta: Meta<typeof WalletBlock> = {
  component: WalletBlock,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
