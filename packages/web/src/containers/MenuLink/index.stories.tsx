import type { Meta, StoryObj } from '@storybook/react'

import MenuLink from './index'

const meta: Meta<typeof MenuLink> = {
  component: MenuLink,
  tags: ['autodocs'],
  argTypes: {
    active: {
      control: 'boolean'
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Link'
  }
}
