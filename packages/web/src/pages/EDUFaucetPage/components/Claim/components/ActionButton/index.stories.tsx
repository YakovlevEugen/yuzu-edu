import type { Meta, StoryObj } from '@storybook/react'

import ActionButton from './index'

const meta: Meta<typeof ActionButton> = {
  component: ActionButton,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
