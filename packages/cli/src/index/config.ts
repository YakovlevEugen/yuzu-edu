import type { IChainId } from '@yuzu/sdk';
import type { Address } from 'viem';
import { getWalletTxs } from './helpers';

export const getStartingBlock = (chainId: IChainId) => {
  switch (chainId) {
    case 'eduTestnet':
      return 68862n; // Sep 25 2024 08:16:49 AM
    default:
      return 0n;
  }
};

export const getExcludedAddresses = (chainId: IChainId) => {
  switch (chainId) {
    case 'eduTestnet':
      return [
        // ArbOS
        '0x00000000000000000000000000000000000A4B05',
        // Block Proposer (Sequencer?)
        '0xA4b000000000000000000073657175656e636572',
        // Gelato Faucet
        '0x30056FD86993624B72c7400bB4D7b29F05928E59',
        // L1 Relay Signer?
        '0x61d8838f9A00250C9AF13D622DA7c08c372ee587',
        // GelatoRelay1BalanceV2
        '0xF9D64d54D32EE2BDceAAbFA60C4C438E224427d0',
        // CounterERC2771
        '0xebDa6113Bb08712889E43338630CEAaA61d53A13'
      ].map((s) => s.toLowerCase());
    default:
      return [];
  }
};

export const getTestnetParticipantPoints = (address: Address) => {
  // based on address, how much points gets produced?
  return getTestnetWalletTxs(address)
    .then((txs) =>
      txs.map((tx) => getAddressBoost(tx.to?.toLowerCase() as Address))
    )
    .then((points) => points.reduce((mem, elem) => mem + elem, 0));
};

const getTestnetWalletTxs = async (address: Address) =>
  getWalletTxs('eduTestnet', address.toLowerCase() as Address);

const getAddressBoost = (address?: Address) =>
  contracts.find((c) => address && c.addresses.includes(address))?.boost || 1;

export const contracts = [
  {
    name: 'Stream Bill',
    addresses: ['0x6b2dbd50b57c0b3d4324734076248a3a81a92270'],
    boost: 2
  },
  {
    name: 'Proof of Learn',
    addresses: ['0x9b6089b63beb5812c388df6cb3419490b4df4d54'],
    boost: 2
  },
  {
    name: 'Prism',
    addresses: ['0xfc37c33e6687e9e61ca09f7ce6edb847ce086a16'],
    boost: 2
  },
  {
    name: 'OpenTaskAI',
    addresses: [
      '0xedfa3e28953ba25173baf11160d4ad435ec002b5',
      '0x3ce79af8a259de19a85807378c13d34ec8cc8895',
      '0x178f9fff66a6960a5574b695ba064894c17c9c2a',
      '0x3212257cac8cf8ec690e232868f90681f2cdf7a3',
      '0xf58cd5deaa238210d2cc1328dd8eb27f5b2a30b2'
    ],
    boost: 2
  },
  {
    name: 'StreamNFT',
    addresses: [
      '0x9a40c4934a36885b54c49342ff2c21d6c51aaa2b',
      '0x908ad45e41a052b87b0c86a609d4cbf59b0c96aa'
    ],
    boost: 2
  },
  {
    name: 'Campus Arc',
    addresses: ['0x48082cf88721053588a0b336322225ff56573d7a'],
    boost: 2
  },
  {
    name: 'Grasp',
    addresses: ['0x3eb2eb8e2a0e26bef3dc3e78289be7343355febc'],
    boost: 2
  },
  {
    name: 'Pumper.lol',
    addresses: ['0xa612ab0e8c9381e956459989f246dc760e0b28e3'],
    boost: 2
  },
  {
    name: 'Lore Network',
    addresses: ['0xb5abb2a63d95bd4595f07a3b67e3840f6b1b9b18'],
    boost: 2
  },
  {
    name: 'Thrustpad',
    addresses: [
      '0xab1eee87c843d38ab7cc4a26383000b291998130',
      '0xe1b2a006271d9cbdf2561091faff7e23281eefe7',
      '0xbd12ffb8c5e6676a7ca18da7b36a912c85ce8b17',
      '0x243d3ed80c9d0b530574e005f0626acf7a02cd33',
      '0xf5b15a5a64301cfcc39c90317ebd6aa3a22cf144'
    ],
    boost: 2
  },
  {
    name: 'Sailfish',
    addresses: ['0xb97582dcb6f2866098ca210095a04df3e11b76a6'],
    boost: 2
  },
  {
    name: 'Echo',
    addresses: ['0x4d4e56028f7bed0b37bcafd7d78afdaf48426527'],
    boost: 2
  },
  {
    name: 'Vault',
    addresses: ['0xefcbcc9a744b393084d9e2234ee27a09020d3cc6'],
    boost: 2
  },
  {
    name: 'Blitz Protocol',
    addresses: ['0x97575899d85557f1c61541358c46ae6a7d60e668'],
    boost: 2
  },
  {
    name: 'EdbankDAO',
    addresses: ['0x514066e1f24fda9f2b379748f9c001c3475625cb'],
    boost: 2
  },
  {
    name: 'MyOrdinals ᴸᵒᵃⁿ',
    addresses: [
      '0xdb8971813d745fe0a9c71c2b7f73fb6407027fa2',
      '0x5b78ce843e7be6c3897d1bfb6fbf1474344bcdc2',
      '0xb1ad3119d8713bf109ff73a60fec2f1fd2f55536'
    ],
    boost: 2
  },
  {
    name: 'YouBetDAO',
    addresses: ['0xd8dcbd828a40f6590a5bee5095c38994dab3bdee'],
    boost: 2
  },
  {
    name: 'Poapedu',
    addresses: ['0x316a879e9b172879c4e05b798a7a5606a2eda845'],
    boost: 2
  },
  {
    name: 'Ludium',
    addresses: ['0x260089fe94760c6ac1f0edf792a61d879106e371'],
    boost: 2
  },
  {
    name: 'EduVR',
    addresses: ['0xb8c296aca0aef6c8e6fd254a077e1978c63011fb'],
    boost: 1
  },
  {
    name: 'AI Tutor',
    addresses: ['0x1a6fc72588770c6fef0985525930f2337db4dcd8'],
    boost: 1
  },
  {
    name: 'D3Lab',
    addresses: ['0xe745f43775b760958cd34ee83b3ab0c088f74630'],
    boost: 1
  },
  {
    name: 'Eduverse',
    addresses: ['0xcddac0b618fb17fbd0405f98316b3b924f3814f3'],
    boost: 1
  },
  {
    name: 'Merge Z',
    addresses: ['0x6e17a2fb312e267311a2fe3d5ef885cf42c2c384'],
    boost: 1
  },
  {
    name: '0sum',
    addresses: ['0x27c608c46cb8d49677530f0e8b34b84eb917e481'],
    boost: 1
  },
  {
    name: 'JiffyScan',
    addresses: ['0x0000000071727de22e5e9d8baf0edac6f37da032'],
    boost: 1
  },
  {
    name: 'Academy DEX',
    addresses: [
      '0xb74d9ea6c7764fb7f98ab993a201fed812af19b6',
      '0xd797ef9819813cb41be7606e027ab123def5ecfd',
      '0x41b0eccea5a023d6655d59ba569f6a60b8ca091b'
    ],
    boost: 1
  }
];
