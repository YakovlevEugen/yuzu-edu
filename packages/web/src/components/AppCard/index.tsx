import BorderBlock from '@/components/BorderBlock';
import SvgIcon from '@/components/SvgIcon';

import { cn } from '@/helpers/lib';
import { buttonVariants } from 'ui/button';
import type { IAppCard } from './types';

interface Props extends IAppCard {
  className?: string;
}

export default function AppCard({
  className,
  logoUrl,
  description,
  name,
  // tokenAmount,
  url
}: Props) {
  const classRoot = cn('', className);

  return (
    <BorderBlock className={classRoot}>
      <div className="flex items-center gap-x-3">
        {logoUrl && (
          <img
            className="h-10 w-10 rounded-full"
            src={logoUrl}
            alt="App Logo"
          />
        )}
        <div className="text-2xl font-semibold">{name}</div>
      </div>

      {description && <div className="mt-4">{description}</div>}

      {/* {tokenAmount && (
        <div className="mt-4 flex items-center gap-x-1">
          <SvgIcon className="text-2xl" name="coin" />
          <span className="text-sm font-bold text-green">
            {formatNumberWithCommas(tokenAmount)} yuzu pt
          </span>
        </div>
      )} */}

      <div className="mt-4">
        <a
          className={cn(buttonVariants())}
          href={url}
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          <span>Open DApp</span>
          <SvgIcon name="external-link" />
        </a>
      </div>
    </BorderBlock>
  );
}
