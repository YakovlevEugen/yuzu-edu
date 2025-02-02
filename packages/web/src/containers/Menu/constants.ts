import { ROUTES } from '@/constants/routes';
import { createEDUChainSubdomainLink } from '@/helpers/url';

export const MENU = [
  {
    title: 'Stake',
    to: ROUTES.stake
  },
  {
    title: 'EDU Faucet',
    to: ROUTES.faucet
  },
  {
    title: 'Community',
    to: ROUTES.community
  },
  {
    title: 'Bridge',
    to: ROUTES.bridge
  },
  {
    title: 'Dashboard',
    to: createEDUChainSubdomainLink('dashboard'),
    external: true
  }
];
