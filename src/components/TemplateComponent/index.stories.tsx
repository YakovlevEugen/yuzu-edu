import type { Meta, StoryObj } from '@storybook/react'

import TemplateComponent from './index'

const meta: Meta<typeof TemplateComponent> = {
  component: TemplateComponent,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
