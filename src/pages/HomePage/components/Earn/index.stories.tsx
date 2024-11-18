import type { Meta, StoryObj } from '@storybook/react'

import Earn from './index'

const meta: Meta<typeof Earn> = {
  component: Earn,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
