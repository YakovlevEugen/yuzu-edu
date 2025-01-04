import type { Meta, StoryObj } from '@storybook/react';

import WalletMenu from './index';

const meta: Meta<typeof WalletMenu> = {
  component: WalletMenu,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};
