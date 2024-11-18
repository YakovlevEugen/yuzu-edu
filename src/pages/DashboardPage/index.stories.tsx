import type { Meta, StoryObj } from '@storybook/react'

import DashboardPage from './index'

const meta: Meta<typeof DashboardPage> = {
  component: DashboardPage,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
