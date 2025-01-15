import { EDU_CHAIN_URL, OPEN_CAMPUS_URL } from '@/constants/routes';

export function createSubdomainLink(baseUrl: string, subdomain: string) {
  const url = new URL(baseUrl);
  url.hostname = `${subdomain}.${url.hostname}`;
  return url.toString();
}

export function createOpenCampusSubdomainLink(subdomain: string) {
  return createSubdomainLink(OPEN_CAMPUS_URL, subdomain);
}

export function createEDUChainSubdomainLink(subdomain: string) {
  return createSubdomainLink(EDU_CHAIN_URL, subdomain);
}
