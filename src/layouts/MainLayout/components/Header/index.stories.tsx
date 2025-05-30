import type { Meta, StoryObj } from '@storybook/react'

import Header from './index'

const meta: Meta<typeof Header> = {
  component: Header,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
