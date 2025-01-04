import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';

import Component from './index';

import { FormSchema } from '@/pages/StakePage/components/Stake';

const meta: Meta<typeof Component> = {
  component: (props) => {
    const formMethods = useForm<FormSchema>({
      defaultValues: {
        amount: ''
      },
      resolver: zodResolver(FormSchema)
    });

    return (
      <FormProvider {...formMethods}>
        <Component {...props} />
      </FormProvider>
    );
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};
