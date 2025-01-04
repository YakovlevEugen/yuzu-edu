import {
  Erc20Bridger,
  EthBridger,
  getArbitrumNetwork,
  registerCustomArbitrumNetwork
} from '@arbitrum/sdk';
import Big from 'big.js';
import { BigNumber } from 'ethers';
import type { Account, Chain, Hex, Transport, WalletClient } from 'viem';
import { type IChainId, arbMainnet, eduMainnet } from '../chains';
import { getPublicClient } from '../clients';
import { clientToProvider, clientToSigner } from '../compat';
import { eduMainnetConfig } from '../networks';
import { getERC20Contract } from './erc20';

registerCustomArbitrumNetwork(eduMainnetConfig);

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

/**
 * Deposits
 */

export const getApproveDepositRequest = async (params: {
  parent: IChainId;
  child: IChainId;
  parentToken: Hex;
}) => {
  const childProvider = clientToProvider(getPublicClient(params.child));
  const parentProvider = clientToProvider(getPublicClient(params.parent));
  const childNetwork = await getArbitrumNetwork(childProvider);
  const parentToken = params.parentToken.toLowerCase();
  const nativeToken = eduMainnetConfig.nativeToken?.toLowerCase();
  const isNativeToken = parentToken === nativeToken;

  if (isNativeToken) {
    return new EthBridger(childNetwork).getApproveGasTokenRequest();
    // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    const bridger = new Erc20Bridger(childNetwork);
    if (
      !(await bridger.isRegistered({
        erc20ParentAddress: params.parentToken,
        childProvider,
        parentProvider
      }))
    ) {
      throw new Error('token bridge is not registered');
    }
    return bridger.getApproveTokenRequest({
      erc20ParentAddress: params.parentToken,
      parentProvider
    });
  }
};

export const approveDeposit = async (params: {
  parent: IChainId;
  child: IChainId;
  parentToken: Hex;
  parentSigner: WalletClient<Transport, Chain, Account>;
}) => {
  const request = await getApproveDepositRequest(params);
  return clientToSigner(params.parentSigner).sendTransaction(request);
};

export const getDepositRequest = async (params: {
  parent: IChainId;
  child: IChainId;
  parentToken: Hex;
  amount: string;
  from: Hex;
}) => {
  const childProvider = clientToProvider(getPublicClient(params.child));
  const parentProvider = clientToProvider(getPublicClient(params.parent));
  const childNetwork = await getArbitrumNetwork(childProvider);
  const parentToken = params.parentToken.toLowerCase();
  const nativeToken = eduMainnetConfig.nativeToken?.toLowerCase();
  const isNativeToken = parentToken === nativeToken;
  const token = getERC20Contract(params.parent, params.parentToken);
  const decimals = await token.read.decimals();
  const amount = new Big(params.amount).mul(10 ** decimals).toFixed(0);

  if (isNativeToken) {
    return new EthBridger(childNetwork).getDepositRequest({
      amount: BigNumber.from(amount),
      from: params.from
    });
    // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    const bridger = new Erc20Bridger(childNetwork);
    if (
      !(await bridger.isRegistered({
        erc20ParentAddress: params.parentToken,
        childProvider,
        parentProvider
      }))
    ) {
      throw new Error('token bridge is not registered');
    }
    return bridger.getDepositRequest({
      amount: BigNumber.from(amount),
      erc20ParentAddress: params.parentToken,
      from: params.from,
      childProvider,
      parentProvider
    });
  }
};

export const deposit = async (params: {
  parent: IChainId;
  child: IChainId;
  parentToken: Hex;
  amount: string;
  parentSigner: WalletClient<Transport, Chain, Account>;
}) => {
  const parentSigner = clientToSigner(params.parentSigner);
  const address = await parentSigner.getAddress();
  const request = await getDepositRequest({ ...params, from: address as Hex });
  return clientToSigner(params.parentSigner).sendTransaction(request.txRequest);
};

/**
 * Withdrawals
 */

export const getWithdrawRequest = async (params: {
  parent: IChainId;
  child: IChainId;
  parentToken: Hex;
  amount: string;
  from: Hex;
}) => {
  const childProvider = clientToProvider(getPublicClient(params.child));
  const parentProvider = clientToProvider(getPublicClient(params.parent));
  const childNetwork = await getArbitrumNetwork(childProvider);
  const parentToken = params.parentToken.toLowerCase();
  const nativeToken = eduMainnetConfig.nativeToken?.toLowerCase();
  const isNativeToken = parentToken === nativeToken;
  const token = getERC20Contract(params.parent, params.parentToken);
  const decimals = await token.read.decimals();
  const amount = new Big(params.amount).mul(10 ** decimals).toFixed(0);

  if (isNativeToken) {
    return new EthBridger(childNetwork).getWithdrawalRequest({
      amount: BigNumber.from(amount),
      from: params.from,
      destinationAddress: params.from
    });
    // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    const bridger = new Erc20Bridger(childNetwork);
    if (
      !(await bridger.isRegistered({
        erc20ParentAddress: params.parentToken,
        childProvider,
        parentProvider
      }))
    ) {
      throw new Error('token bridge is not registered');
    }
    return bridger.getWithdrawalRequest({
      amount: BigNumber.from(amount),
      destinationAddress: params.from,
      erc20ParentAddress: params.parentToken,
      from: params.from
    });
  }
};

export const withdraw = async (params: {
  parent: IChainId;
  child: IChainId;
  parentToken: Hex;
  amount: string;
  childSigner: WalletClient<Transport, Chain, Account>;
}) => {
  const childProvider = clientToSigner(params.childSigner);
  const address = await childProvider.getAddress();
  const request = await getWithdrawRequest({ ...params, from: address as Hex });
  return clientToSigner(params.childSigner).sendTransaction(request.txRequest);
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

// (async () => {
// 	const tvl = await getTVL({
// 		child: "eduMainnet",
// 		parent: "arbMainnet",
// 		parentToken: arbMainnet.contracts.edu.address,
// 	});

// 	console.log(tvl);
// })();
