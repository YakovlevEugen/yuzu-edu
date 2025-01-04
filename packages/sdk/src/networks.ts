import type { ArbitrumNetwork } from '@arbitrum/sdk';

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
    parentWethGateway: '0x0000000000000000000000000000000000000000',
    childWethGateway: '0x0000000000000000000000000000000000000000',
    parentWeth: '0x0000000000000000000000000000000000000000',
    childWeth: '0x0000000000000000000000000000000000000000',
    parentProxyAdmin: '0x79daC9c2deC3E4411a2cB2b0ecf654D27a4AFf0A',
    childProxyAdmin: '0x3Bb11Aa109cCe35aCB73B043cC51b76bCE5999d7',
    parentMultiCall: '0x90B02D9F861017844F30dFbdF725b6aa84E63822',
    childMultiCall: '0xB9199cA38F678bE120350d1baEE8a7b8eCd52A06'
  }
} as const;
