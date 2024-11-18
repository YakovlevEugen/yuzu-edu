import type { Meta, StoryObj } from '@storybook/react'

import MainLayout from './index'

const meta: Meta<typeof MainLayout> = {
  component: MainLayout,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
