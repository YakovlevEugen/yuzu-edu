import { type VariantProps, cva } from 'class-variance-authority';
import {
  NavLink,
  type NavLinkProps,
  type NavLinkRenderProps
} from 'react-router-dom';

import { cn } from '@/helpers/lib';

const variants = cva('flex items-center text-gray-light font-semibold', {
  variants: {
    active: {
      default: 'text-gray-light',
      true: 'text-gray'
    }
  },
  defaultVariants: {
    active: 'default'
  }
});

interface Props extends NavLinkProps, VariantProps<typeof variants> {
  active?: boolean;
  className?: string;
}

export default function MenuLink({
  active,
  children,
  className,
  ...props
}: Props) {
  function getClassLink({ isActive }: NavLinkRenderProps) {
    return cn(variants({ active: active || isActive }), className);
  }

  return (
    <NavLink className={getClassLink} {...props}>
      {children}
    </NavLink>
  );
}
