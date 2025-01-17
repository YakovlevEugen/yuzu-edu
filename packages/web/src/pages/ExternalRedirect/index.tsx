import { createEDUChainSubdomainLink } from '@/helpers/url';
import { useEffect } from 'react';

interface Props {
  path: string;
}

export default function ExternalRedirect({ path }: Props) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (['claim', 'dashboard', 'rental'].includes(path)) {
      window.location.replace(createEDUChainSubdomainLink('dashboard'));
    } else {
      window.location.replace(path);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
