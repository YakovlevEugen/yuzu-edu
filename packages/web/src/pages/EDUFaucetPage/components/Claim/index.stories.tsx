import type { Meta, StoryObj } from '@storybook/react'

import Claim from './index'

const meta: Meta<typeof Claim> = {
  component: Claim,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
