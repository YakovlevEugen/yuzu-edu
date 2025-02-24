import AppCard from '@/components/AppCard';

import { cn } from '@/helpers/lib';
import { apps } from './constants';

interface Props {
  className?: string;
}

export default function SpotlightApps({ className }: Props) {
  const classRoot = cn('container-base', className);

  return (
    <div className={classRoot}>
      <div className="text-center">
        <div className="text-4xl font-bold tracking-tighter md:text-6xl">
          Spotlight Apps
        </div>
        <p className="mt-8">
          Browse and explore dapps from Defi, Infra to EDUFI, and more, which
          are helping to bring education on-chain to EDUCHAIN
        </p>
      </div>

      <div className="mt-8 flex flex-col justify-start gap-x-2 gap-y-4 sm:flex-row sm:flex-wrap">
        {apps.map((app) => (
          <AppCard
            key={app.name}
            className="flex-1 sm:flex-col-2 lg:flex-col-3"
            {...app}
          />
        ))}
      </div>
    </div>
  );
}
