import { OPEN_CAMPUS_URL } from '@/constants/routes';
import { createOpenCampusSubdomainLink } from '@/helpers/url';
import type { Menu } from './types';

export const MENU: Menu[] = [
  {
    title: 'Products',
    children: [
      {
        label: 'OC ID',
        link: createOpenCampusSubdomainLink('id')
      },
      {
        label: 'OC-X',
        link: createOpenCampusSubdomainLink('ocx')
      },
      {
        label: 'Publisher NFT',
        link: createOpenCampusSubdomainLink('mint')
      }
    ]
  },
  {
    title: 'EDU',
    children: [
      {
        label: 'Whitepaper',
        link: createOpenCampusSubdomainLink('userdocs')
      },
      {
        label: 'CoinMarketCap',
        link: 'https://coinmarketcap.com/currencies/open-campus/'
      },
      {
        label: 'CoinGecko',
        link: 'https://www.coingecko.com/en/coins/open-campus'
      }
    ]
  },
  {
    title: 'ABOUT',
    children: [
      {
        label: 'OC Partners',
        link: `${OPEN_CAMPUS_URL}partners`
      },
      {
        label: 'OC 100',
        link: createOpenCampusSubdomainLink('100')
      },
      {
        label: 'Media Kit',
        link: 'https://drive.google.com/drive/folders/13JDKr5Z6wdjU5qJjJGG6PqQmeSnC1cTl'
      }
    ]
  },
  {
    title: 'LEGAL',
    children: [
      {
        label: 'Disclaimer',
        link: 'https://animocabrands-portfolio.notion.site/EDU-Chain-Testnet-Disclaimer-10c5a6eae96380018bf0ef6788d98432'
      }
    ]
  }
];
