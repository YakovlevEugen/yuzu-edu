import type { Meta, StoryObj } from '@storybook/react';

import CurrencyInput from './index';

const meta: Meta<typeof CurrencyInput> = {
  component: CurrencyInput,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};
