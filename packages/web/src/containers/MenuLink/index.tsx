import { type VariantProps, cva } from 'class-variance-authority';
import type { ReactNode } from 'react';
import {
  NavLink,
  type NavLinkProps,
  type NavLinkRenderProps
} from 'react-router-dom';

import SvgIcon from '@/components/SvgIcon';
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
  external?: boolean;
  className?: string;
}

export default function MenuLink({
  active,
  external,
  children,
  className,
  ...props
}: Props) {
  function getClassLink({ isActive }: Partial<NavLinkRenderProps>) {
    return cn(variants({ active: active || isActive }), className);
  }

  function getClassExternalLink(additionalClass = '') {
    return cn(getClassLink({ isActive: false }), additionalClass);
  }

  return (
    <>
      {external ? (
        <a
          className={getClassExternalLink('items-start')}
          href={props.to as string}
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          {children as ReactNode}
          <SvgIcon className="ml-1 h-4 w-4" name="external-link" />
        </a>
      ) : (
        <NavLink className={getClassLink} {...props}>
          {children}
        </NavLink>
      )}
    </>
  );
}
