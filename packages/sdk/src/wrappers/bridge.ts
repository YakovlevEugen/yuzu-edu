import { Erc20Bridger, EthBridger, getArbitrumNetwork } from '@arbitrum/sdk';
import Big from 'big.js';
import { BigNumber } from 'ethers';
import type { Address, Hex } from 'viem';
import type { IChainId } from '../chains';
import { getPublicClient } from '../clients';
import { clientToProvider } from '../compat';
import { eduMainnetConfig } from '../networks';
import { encodeTxRequest } from '../requests';
import { getERC20Contract } from './erc20';

/**
 * Deposits
 */

// TODO: need to check for sufficient EDU balance and allowance when interacting w/ `parentErc20Gateway`
// it's possible to check allowance

// TODO: need to check for sufficient EDU balance and allowance when interacting w/ `parentErc20Gateway`
// it's possible to check allowance

// TODO: index txs

export const getApproveRequest = async (params: {
  parent: IChainId;
  child: IChainId;
  parentToken: Hex;
  amount: string;
  account: Address;
}) => {
  const childProvider = clientToProvider(getPublicClient(params.child));
  const parentProvider = clientToProvider(getPublicClient(params.parent));
  const childNetwork = await getArbitrumNetwork(childProvider);
  const erc20ParentAddress = params.parentToken.toLowerCase();
  const nativeToken = childNetwork.nativeToken?.toLowerCase();
  const isNativeToken = erc20ParentAddress === nativeToken;
  const token = getERC20Contract(params.parent, params.parentToken);
  const decimals = await token.read.decimals();
  const amount = new Big(params.amount).mul(10 ** decimals).toFixed(0);
  const ethBridger = new EthBridger(childNetwork);
  const ercBridger = new Erc20Bridger(childNetwork);

  if (isNativeToken) {
    const request = ethBridger.getApproveGasTokenRequest({
      amount: BigNumber.from(amount)
    });
    return encodeTxRequest({ from: params.account, ...request });
  } else {
    return ercBridger
      .getApproveTokenRequest({
        erc20ParentAddress,
        parentProvider,
        amount: BigNumber.from(amount)
      })
      .then((request) => encodeTxRequest({ from: params.account, ...request }));
  }
};

export const getDepositRequest = async (params: {
  parent: IChainId;
  child: IChainId;
  parentToken: Hex;
  amount: string;
  account: Hex;
}) => {
  const childProvider = clientToProvider(getPublicClient(params.child));
  const parentProvider = clientToProvider(getPublicClient(params.parent));
  const childNetwork = await getArbitrumNetwork(childProvider);
  const erc20ParentAddress = params.parentToken.toLowerCase();
  const nativeToken = eduMainnetConfig.nativeToken?.toLowerCase();
  const isNativeToken = erc20ParentAddress === nativeToken;
  const token = getERC20Contract(params.parent, params.parentToken);
  const decimals = await token.read.decimals();
  const amount = new Big(params.amount).mul(10 ** decimals).toFixed(0);
  const ethBridger = new EthBridger(childNetwork);
  const ercBridger = new Erc20Bridger(childNetwork);

  if (isNativeToken) {
    return ethBridger
      .getDepositRequest({
        from: params.account,
        amount: BigNumber.from(amount)
      })
      .then(({ txRequest }) => txRequest)
      .then(encodeTxRequest);
  } else {
    return ercBridger
      .getDepositRequest({
        from: params.account,
        erc20ParentAddress,
        childProvider,
        parentProvider,
        amount: BigNumber.from(amount)
      })
      .then(({ txRequest }) => txRequest)
      .then(encodeTxRequest);
  }
};

/**
 * Withdrawals
 */

export const getWithdrawRequest = async (params: {
  parent: IChainId;
  child: IChainId;
  parentToken: Hex;
  amount: string;
  account: Hex;
}) => {
  const childProvider = clientToProvider(getPublicClient(params.child));
  const childNetwork = await getArbitrumNetwork(childProvider);
  const erc20ParentAddress = params.parentToken.toLowerCase();
  const nativeToken = eduMainnetConfig.nativeToken?.toLowerCase();
  const isNativeToken = erc20ParentAddress === nativeToken;
  const token = getERC20Contract(params.parent, params.parentToken);
  const decimals = await token.read.decimals();
  const amount = new Big(params.amount).mul(10 ** decimals).toFixed(0);
  const ethBridger = new EthBridger(childNetwork);
  const ercBridger = new Erc20Bridger(childNetwork);

  if (isNativeToken) {
    return ethBridger
      .getWithdrawalRequest({
        from: params.account,
        destinationAddress: params.account,
        amount: BigNumber.from(amount)
      })
      .then(({ txRequest }) => txRequest)
      .then(encodeTxRequest);
  } else {
    return ercBridger
      .getWithdrawalRequest({
        from: params.account,
        destinationAddress: params.account,
        erc20ParentAddress: params.parentToken,
        amount: BigNumber.from(amount)
      })
      .then(({ txRequest }) => txRequest)
      .then(encodeTxRequest);
  }
};

/**
 * Check Gateway (Bridge) TVL
 */

export const getTVL = async (params: {
  child: IChainId;
  parent: IChainId;
  parentToken: Hex;
}) => {
  const parentProvider = clientToProvider(getPublicClient(params.parent));
  const childProvider = clientToProvider(getPublicClient(params.child));
  const childNetwork = await getArbitrumNetwork(childProvider);
  const parentToken = params.parentToken.toLowerCase();
  const nativeToken = eduMainnetConfig.nativeToken?.toLowerCase();
  const isNativeToken = parentToken === nativeToken;

  const token = getERC20Contract(params.parent, params.parentToken);

  let address: Hex = '0x';

  if (isNativeToken) {
    address = childNetwork.ethBridge.bridge as Hex;
  } else {
    const erc20Bridger = new Erc20Bridger(childNetwork);
    address = (await erc20Bridger.getParentGatewayAddress(
      params.parentToken,
      parentProvider
    )) as Hex;
  }

  const [decimals, balance] = await Promise.all([
    token.read.decimals(),
    token.read.balanceOf([address])
  ]);

  return new Big(balance.toString()).div(10 ** decimals).toFixed(decimals);
};

/**
 * Bridged Token Address on Child Chain
 */

export const getChildTokenContract = async (params: {
  child: IChainId;
  parent: IChainId;
  parentToken: Hex;
}) => {
  const childProvider = clientToProvider(getPublicClient(params.child));
  const parentProvider = clientToProvider(getPublicClient(params.parent));
  const childNetwork = await getArbitrumNetwork(childProvider);
  const erc20Bridger = new Erc20Bridger(childNetwork);

  const tokenAddress = await erc20Bridger.getChildErc20Address(
    params.parentToken,
    parentProvider
  );

  return erc20Bridger.getChildTokenContract(childProvider, tokenAddress);
};

export const getChildTokenAddress = async (params: {
  parent: IChainId;
  child: IChainId;
  parentToken: Hex;
}) => {
  const parentProvider = clientToProvider(getPublicClient(params.parent));
  const childProvider = clientToProvider(getPublicClient(params.child));
  const childNetwork = await getArbitrumNetwork(childProvider);
  const erc20Bridger = new Erc20Bridger(childNetwork);
  return erc20Bridger.getChildErc20Address(params.parentToken, parentProvider);
};
