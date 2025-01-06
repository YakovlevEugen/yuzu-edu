import {
  type ArbitrumNetwork,
  registerCustomArbitrumNetwork
} from '@arbitrum/sdk';

export const eduMainnetConfig: ArbitrumNetwork = {
  name: 'EDU Mainnet',
  isTestnet: false,
  isCustom: true,
  chainId: 41923,
  parentChainId: 42161,
  confirmPeriodBlocks: 45818,
  nativeToken: '0xf8173a39c56a554837C4C7f104153A005D284D11',

  ethBridge: {
    bridge: '0x2F12c50b46adB01a4961AdDa5038c0974C7C78e8',
    inbox: '0x590044e628ea1B9C10a86738Cf7a7eeF52D031B8',
    outbox: '0x6339965Cb3002f5c746895e4eD895bd775dbfdf9',
    rollup: '0xBaE3B462a2A7fb758F66D91170514C10B14Ce914',
    sequencerInbox: '0xA3464bf0ed52cFe6676D3e34ab1F4DF53f193631'
  },

  tokenBridge: {
    parentGatewayRouter: '0xDa4ac9E9cB8Af8afBB2Df1ffe7b82efEA17ba0f6',
    childGatewayRouter: '0xFd25B25576cC0d510F62C88A166F84b3e25208C7',
    parentErc20Gateway: '0x419e439e5c0B839d6e31d7C438939EEE1A4f4184',
    childErc20Gateway: '0x9E8f79EE5177aBDd76EDfC7D72c8Dc0F16955ae3',
    parentCustomGateway: '0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759',
    childCustomGateway: '0xA9f18587F6dE8B1c89a4AdD2c953AB66eD532015',
    parentWethGateway: '0x419e439e5c0B839d6e31d7C438939EEE1A4f4184',
    childWethGateway: '0x9E8f79EE5177aBDd76EDfC7D72c8Dc0F16955ae3',
    parentWeth: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    childWeth: '0xa572BF655F61930B6f0d4546A67cD1376220081a',
    parentProxyAdmin: '0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A',
    childProxyAdmin: '0x3Bb11Aa109cCe35aCB73B043cC51b76bCE5999d7',
    parentMultiCall: '0x90B02D9F861017844F30dFbdF725b6aa84E63822',
    childMultiCall: '0xB9199cA38F678bE120350d1baEE8a7b8eCd52A06'
  }
} as const;

// !!! Edu Received from Arbitrum Bridge came from: 0xECE9e8Bc1a1b6A563d4B9F75f72e577c42892108
// Edu Received some time before by a diff wallet -> 0x8d930F9eBF6e90c8F29fe0E2A2A2F48c31b646E4

export const eduTestnetConfig: ArbitrumNetwork = {
  name: 'EDU Testnet',
  isTestnet: true,
  isCustom: true,
  chainId: 656476,
  parentChainId: 421614,
  confirmPeriodBlocks: 45818,
  nativeToken: '0x4489254947C9027bA6506c57DaC86bECc9c25384',

  ethBridge: {
    bridge: '0xbf3D64671154D1FB0b27Cb1decbE1094d7016448',
    inbox: '0x67F231eDC83a66556148673863e73D705422A678',
    outbox: '0x0FcCC9dC3E128fFFc2c4d01E523e05FcF28629B3',
    rollup: '0x0A94003d3482128c89395aBd94a41DA8eeBB59f7',
    sequencerInbox: '0xd5131c1924f080D45CA3Ae97262c0015F675004b'
  },

  tokenBridge: {
    parentGatewayRouter: '0x962170D0A0D123061D8A8D344eEB5664aa62C407',
    childGatewayRouter: '0xFc94235bbfaC6b8BB6CAE49297c8a1D70a69b484',
    parentErc20Gateway: '0xd16E8b904BE8Db6FaB0C375c4eeA5BCDC6dcAa91',
    childErc20Gateway: '0x2a5302C754f0DcDe224Cd26F887b9B976CBeD972',
    parentCustomGateway: '0x4FdD213c3c866b8C0f35a0c6280D2146D10648Bd',
    childCustomGateway: '0x46404F60208129deD3574f23Cdd86412609D616A',
    parentWethGateway: '0xd16E8b904BE8Db6FaB0C375c4eeA5BCDC6dcAa91',
    childWethGateway: '0x2a5302C754f0DcDe224Cd26F887b9B976CBeD972',
    parentWeth: '0x980B62Da83eFf3D4576C647993b0c1D7faf17c73',
    childWeth: '0xbA62F94e391fd0AD6f6728F75B140aa426DEa3C9',
    parentProxyAdmin: '0xA05c9EF66fbc3cFd44D1E3AbeA7635eCFa6eb60f',
    childProxyAdmin: '0xE0b19fd6581E537E843F487dAD552D9B41299699',
    parentMultiCall: '0xce1CAd780c529e66e3aa6D952a1ED9A6447791c1',
    childMultiCall: '0x8e4fD6E585B055755a8fE6E5083Ed6dddD53a1f2'
  }
} as const;

registerCustomArbitrumNetwork(eduMainnetConfig);
registerCustomArbitrumNetwork(eduTestnetConfig);
