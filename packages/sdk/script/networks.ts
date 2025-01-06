import {
  Erc20Bridger,
  getArbitrumNetworkInformationFromRollup
} from '@arbitrum/sdk';

import { getPublicClient } from '../src';
import { clientToProvider } from '../src/compat';
import { eduTestnetConfig } from '../src/networks';

(async () => {
  const parentProvider = clientToProvider(getPublicClient('arbTestnet'));
  const childProvider = clientToProvider(getPublicClient('eduTestnet'));

  console.log(
    'network',
    await getArbitrumNetworkInformationFromRollup(
      eduTestnetConfig.ethBridge.rollup,
      parentProvider
    )
  );

  const erc20Bridger = await Erc20Bridger.fromProvider(childProvider);

  console.log(
    'erc20gateway',
    await erc20Bridger.getParentGatewayAddress(
      '0x4489254947C9027bA6506c57DaC86bECc9c25384',
      parentProvider
    )
  );

  console.log(
    'child erc20 gateway',
    await erc20Bridger.getChildGatewayAddress(
      '0x4489254947C9027bA6506c57DaC86bECc9c25384',
      childProvider
    )
  );

  console.log(
    'weth address on educhain',
    await erc20Bridger.getChildErc20Address(
      '0x980B62Da83eFf3D4576C647993b0c1D7faf17c73', // WETH on Arb Sepolia
      parentProvider
    )
  ); // 0xbA62F94e391fd0AD6f6728F75B140aa426DEa3C9

  console.log(
    'usdt address on educhain',
    await erc20Bridger.getChildErc20Address(
      '0x30fA2FbE15c1EaDfbEF28C188b7B8dbd3c1Ff2eB', // USDT on Arb Sepolia
      parentProvider
    )
  ); // 0x089c69Dfb548B6f9dd878A0CA7718555507e2254
})();
