import type { Meta, StoryObj } from '@storybook/react';

import Component from './index';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="h-full w-full">
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Status403: Story = {
  args: {
    status: 403
  }
};

export const Status404: Story = {
  args: {
    status: 404
  }
};
