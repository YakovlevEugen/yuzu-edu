import { type VariantProps, cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

import { cn } from '@/helpers/lib';

const variants = cva('border-2 rounded-2xl shadow-border-box', {
  variants: {
    variant: {
      default: 'bg-beige',
      yellow: 'bg-yellow',
      darkGreen: 'bg-foreground'
    },
    padding: {
      none: '',
      sm: 'p-border-box-sm',
      md: 'p-border-box'
    }
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md'
  }
});

interface Props extends VariantProps<typeof variants> {
  children?: ReactNode;
  className?: string;
}

export default function BorderBlock({
  children,
  className,
  variant,
  padding
}: Props) {
  const classRoot = cn(variants({ className, padding, variant }));

  return <div className={classRoot}>{children}</div>;
}
