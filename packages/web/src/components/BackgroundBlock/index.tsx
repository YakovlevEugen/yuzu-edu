import { type VariantProps, cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

import { cn } from '@/helpers/lib';

const variants = cva('rounded-2xl', {
  variants: {
    variant: {
      default: 'bg-green-muted'
    },
    padding: {
      none: '',
      sm: 'p-border-box-sm',
      md: 'p-border-box'
    }
  },
  defaultVariants: {
    variant: 'default',
    padding: 'sm'
  }
});

interface Props extends VariantProps<typeof variants> {
  children?: ReactNode;
  className?: string;
}

export default function BackgroundBlock({
  children,
  className,
  padding,
  variant
}: Props) {
  const classRoot = cn(variants({ className, padding, variant }));

  return <div className={classRoot}>{children}</div>;
}
