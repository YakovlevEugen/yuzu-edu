import type { Meta, StoryObj } from '@storybook/react';

import Menu from './index';

const meta: Meta<typeof Menu> = {
  component: Menu,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};
