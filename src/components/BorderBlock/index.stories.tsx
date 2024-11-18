import type { Meta, StoryObj } from '@storybook/react'

import BorderBlock from './index'

const meta: Meta<typeof BorderBlock> = {
  component: BorderBlock,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: { type: 'text' }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
