import type { Meta, StoryObj } from '@storybook/react'

import InfoItem from './index'

const meta: Meta<typeof InfoItem> = {
  component: InfoItem,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' }
    },
    value: {
      control: { type: 'text' }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
