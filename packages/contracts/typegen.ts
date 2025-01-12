import fs from 'fs';
import faucetMainnet from './abi/faucet.mainnet.json';
import faucetTestnet from './abi/faucet.testnet.json';
import weduTestnet from './abi/wedu.testnet.json';

fs.writeFileSync(
  'abi/addresses.json',
  JSON.stringify(
    {
      testnet: {
        faucet: faucetTestnet.address,
        wedu: weduTestnet.address
      },
      mainnet: {
        faucet: faucetMainnet.address
      }
    },
    null,
    2
  )
);

fs.writeFileSync(
  'abi/faucet.ts',
  `export const abi = ${fs.readFileSync('./abi/faucet.json', 'utf8').trim()} as const;`
);

fs.writeFileSync(
  'abi/wedu.ts',
  `export const abi = ${fs.readFileSync('./abi/wedu.json', 'utf8').trim()} as const;`
);
