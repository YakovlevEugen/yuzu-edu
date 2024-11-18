import type { Meta, StoryObj } from '@storybook/react'

import TransformCurrency from './index'

const meta: Meta<typeof TransformCurrency> = {
  component: (props) => (
    <div className="bg-background p-4">
      <TransformCurrency {...props} />
    </div>
  ),
  tags: ['autodocs'],
  argTypes: {
    from: {
      control: { type: 'text' }
    },
    to: {
      control: { type: 'text' }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
