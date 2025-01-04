import SvgIcon from '@/components/SvgIcon';

import { cn } from '@/helpers/lib';

interface Props {
  className?: string;
}

export default function LoadingPage({ className }: Props) {
  const classRoot = cn(
    'flex h-screen w-screen flex-col items-center justify-center',
    className
  );

  return (
    <div className={classRoot}>
      <div className="animate-bounce">
        <SvgIcon className="h-[64px] w-[64px]" name="coin" />
      </div>
      <div className="mt-4 text-center text-xl">
        Finishing up and preparing your dashboard...
      </div>
    </div>
  );
}
