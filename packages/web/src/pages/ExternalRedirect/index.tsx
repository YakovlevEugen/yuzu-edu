import { ROUTES } from '@/constants/routes';
import { createEDUChainSubdomainLink } from '@/helpers/url';
import { useEffect } from 'react';

interface Props {
  path: string;
}

export default function ExternalRedirect({ path }: Props) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (['claim', 'dashboard', 'rental'].includes(path)) {
      window.location.href = createEDUChainSubdomainLink('dashboard');
    } else {
      window.location.href = ROUTES.notFound;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
