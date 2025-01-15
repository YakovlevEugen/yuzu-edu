import { ROUTES } from '@/constants/routes';
import { createEDUChainSubdomainLink } from '@/helpers/url';

interface Props {
  path: string;
}

export default function ExternalRedirect({ path }: Props) {
  if (['claim', 'dashboard', 'rental'].includes(path)) {
    window.location.href = createEDUChainSubdomainLink('dashboard');
  } else {
    window.location.href = ROUTES.notFound;
  }

  return null;
}
