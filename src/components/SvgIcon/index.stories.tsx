import type { Meta, StoryObj } from '@storybook/react'

import SvgIcon from './index'

const meta: Meta<typeof SvgIcon> = {
  component: SvgIcon,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'coin'
  }
}
