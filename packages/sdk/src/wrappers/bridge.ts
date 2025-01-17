import {
  ChildToParentMessage,
  ChildTransactionReceipt,
  Erc20Bridger,
  EthBridger,
  ParentContractCallTransactionReceipt,
  ParentEthDepositTransactionReceipt,
  getArbitrumNetwork
} from '@arbitrum/sdk';
import { erc20Abi } from 'abitype/abis';
import Big from 'big.js';
import { BigNumber } from 'ethers';
import { type Address, type Hex, encodeFunctionData, getContract } from 'viem';
import * as erc20gateway from '../abi/ERC20Gateway';
import * as erc20outbox from '../abi/ERC20Outbox';
import type { IChainId } from '../chains';
import { getPublicClient } from '../clients';
import { clientToProvider } from '../compat';
import { assert } from '../helpers';
import { eduMainnetConfig } from '../networks';
import { encodeTxRequest } from '../requests';
import { getERC20Contract } from './erc20';

/**
 * Deposits
 */

export const getDeposits = async (params: {
  parent: IChainId;
  child: IChainId;
  address: Address;
}) => {
  // get all wallet deposits with status

  // Deposit Edu from Arb to Edu Chain
  // ERC20 Inbox (0x590044e628ea1b9c10a86738cf7a7eef52d031b8) -> depositERC20(uint256 amount)
  // https://arbiscan.io/tx/0x3e931563767bc4d3e6ff4794c2a7953901cddae5fe95a92e1b3b468e9e66a54b (ERC20Inbox)
  // ERC20Bridge: 0x2a6DD4433ffa96dc1755814FC0d9cc83A5F68DeC

  // Deposit ERC20 from Arb to Edu Chain
  // L1OrbitGatewayRouter (0xd106EC93D2c1adaA65C4B17ffc7bB166Ce30DDAe) ->
  // outboundTransfer(address _token, address _to, uint256 _amount, uint256 _maxGas, uint256 _gasPriceBid, bytes _data) ***
  // parent token, my wallet addy, amount, max gas, gas price bid, 0x??? some data here

  // parentErc20Gateway: '0x419e439e5c0B839d6e31d7C438939EEE1A4f4184',

  const [nativeDeposits, erc20Deposits] = await Promise.all([
    getNativeDeposits(params),
    getERC20Deposits(params)
  ]);

  console.log({ nativeDeposits, erc20Deposits });

  const deposits = nativeDeposits
    .concat(erc20Deposits)
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

  return deposits;
};

export const getERC20Deposits = async (params: {
  parent: IChainId;
  child: IChainId;
  address: Address;
}) => {
  const parentClient = getPublicClient(params.parent);
  const parentProvider = clientToProvider(parentClient);
  const parentNetwork = await getArbitrumNetwork(parentProvider);
  const parentGatewayAddress = parentNetwork.tokenBridge
    ?.parentErc20Gateway as Address;

  const events = await parentClient
    .getContractEvents({
      address: parentGatewayAddress,
      abi: erc20gateway.abi,
      eventName: 'DepositInitiated',
      args: { _from: params.address, _to: params.address },
      strict: true
    })
    .then((list) => list.slice(0, 20));

  const output: {
    type: 'deposit';
    token: Address;
    amount: string;
    createdAt: string;
    parentSignature: Hex;
    childSignature?: Hex;
  }[] = [];

  for (const event of events) {
    const parentToken = event.args.l1Token;

    const [block, decimals, receipt] = await Promise.all([
      parentClient.getBlock({
        blockNumber: event.blockNumber,
        includeTransactions: false
      }),
      getContract({
        abi: erc20Abi,
        address: event.args.l1Token,
        client: parentClient
      }).read.decimals(),
      getDepositReceipt({
        ...params,
        parentToken,
        parentSignature: event.transactionHash
      })
    ]);

    output.push({
      type: 'deposit',
      token: parentToken,
      amount: new Big(event.args._amount.toString())
        .div(10 ** decimals)
        .toFixed(decimals),
      createdAt: new Date(
        new Big(block.timestamp.toString()).mul(1000).toFixed(0)
      ).toISOString(),
      parentSignature: event.transactionHash,
      childSignature: receipt.childSignature
    });
  }

  return output;
};

export const getNativeDeposits = async (params: {
  parent: IChainId;
  child: IChainId;
  address: Address;
}) => {
  const childClient = getPublicClient(params.child);
  const parentClient = getPublicClient(params.parent);
  const childProvider = clientToProvider(childClient);
  const parentProvider = clientToProvider(parentClient);
  const parentNetwork = await getArbitrumNetwork(parentProvider);
  const parentErc20Inbox = parentNetwork.ethBridge.inbox as Address;
  const childNetwork = await getArbitrumNetwork(childProvider);
  const nativeToken = childNetwork.nativeToken as Address;

  const events = await parentClient.getContractEvents({
    address: nativeToken,
    abi: erc20Abi,
    eventName: 'Transfer',
    args: { from: params.address, to: parentErc20Inbox },
    strict: true
  });

  console.log(events);

  const output: {
    type: 'deposit';
    token: Address;
    amount: string;
    createdAt: string;
    parentSignature: Hex;
    childSignature?: Hex;
  }[] = [];

  for (const event of events) {
    const [block, decimals, receipt] = await Promise.all([
      parentClient.getBlock({
        blockNumber: event.blockNumber,
        includeTransactions: false
      }),
      18, // all gas tokens are 18
      getDepositReceipt({
        ...params,
        parentToken: nativeToken,
        parentSignature: event.transactionHash
      })
    ]);

    output.push({
      type: 'deposit',
      token: nativeToken,
      amount: new Big(event.args.value.toString())
        .div(10 ** decimals)
        .toFixed(decimals),
      createdAt: new Date(
        new Big(block.timestamp.toString()).mul(1000).toFixed(0)
      ).toISOString(),
      parentSignature: event.transactionHash,
      childSignature: receipt.childSignature
    });
  }

  return output;
};

export const getDepositReceipt = async (params: {
  parent: IChainId;
  child: IChainId;
  parentToken: Address;
  parentSignature: Hex;
}) => {
  const childProvider = clientToProvider(getPublicClient(params.child));
  const parentProvider = clientToProvider(getPublicClient(params.parent));
  const childNetwork = await getArbitrumNetwork(childProvider);
  const nativeToken = childNetwork.nativeToken?.toLowerCase();
  const erc20ParentAddress = params.parentToken.toLowerCase();
  const isNativeToken = erc20ParentAddress === nativeToken;
  const txReceipt = await parentProvider.getTransactionReceipt(
    params.parentSignature
  );

  if (isNativeToken) {
    return new ParentEthDepositTransactionReceipt(txReceipt)
      .waitForChildTransactionReceipt(childProvider)
      .then(({ complete, childTxReceipt }) => ({
        complete,
        childSignature: childTxReceipt?.transactionHash as Hex | undefined
      }));
  } else {
    return new ParentContractCallTransactionReceipt(txReceipt)
      .waitForChildTransactionReceipt(childProvider)
      .then((res) => ({
        complete: res.complete,
        childSignature:
          'childTxReceipt' in res
            ? (res.childTxReceipt.transactionHash as Hex)
            : undefined
      }));
  }
};

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
 * - Trigger from L3
 * - Ready on L2
 * - Claim on L2
 */

export const isClaimable = async (params: {
  parent: IChainId;
  child: IChainId;
  signature: Hex;
}) => {
  const childClient = getPublicClient(params.child);
  const parentClient = getPublicClient(params.parent);
  const parentProvider = clientToProvider(parentClient);
  const childProvider = clientToProvider(childClient);
  const txReceipt = await childProvider.getTransactionReceipt(params.signature);
  const l2TxReceipt = new ChildTransactionReceipt(txReceipt);
  const [event] = l2TxReceipt.getChildToParentEvents();

  if (!event) return false;
  if (!('position' in event)) return false;

  const proof = await ChildToParentMessage.fromEvent(
    parentProvider,
    event
  ).getOutboxProof(childProvider);

  if (!proof) return false;

  const childNetwork = await getArbitrumNetwork(childProvider);

  const outbox = getContract({
    abi: erc20outbox.abi,
    address: childNetwork.ethBridge.outbox as Address,
    client: parentClient
  });

  await outbox.simulate.executeTransaction([
    proof as Hex[],
    event.position.toBigInt(),
    event.caller as Hex,
    event.destination as Hex,
    event.arbBlockNum.toBigInt(),
    event.ethBlockNum.toBigInt(),
    event.timestamp.toBigInt(),
    event.callvalue.toBigInt(),
    event.data as Hex
  ]);
};

export const claimWithdrawal = async (params: {
  parent: IChainId;
  child: IChainId;
  signature: Hex;
  account: Address;
}) => {
  const childClient = getPublicClient(params.child);
  const parentClient = getPublicClient(params.parent);
  const parentProvider = clientToProvider(parentClient);
  const childProvider = clientToProvider(childClient);
  const txReceipt = await childProvider.getTransactionReceipt(params.signature);
  const l2TxReceipt = new ChildTransactionReceipt(txReceipt);
  const [event] = l2TxReceipt.getChildToParentEvents();

  assert(event, 'event missing');
  assert('position' in event, 'event.position missing');

  const proof = await ChildToParentMessage.fromEvent(
    parentProvider,
    event
  ).getOutboxProof(childProvider);

  assert(proof, 'proof missing');

  const childNetwork = await getArbitrumNetwork(childProvider);
  const address = childNetwork.ethBridge.outbox as Address;

  const data = encodeFunctionData({
    functionName: 'executeTransaction',
    abi: erc20outbox.abi,
    args: [
      proof as Hex[],
      event.position.toBigInt(),
      event.caller as Hex,
      event.destination as Hex,
      event.arbBlockNum.toBigInt(),
      event.ethBlockNum.toBigInt(),
      event.timestamp.toBigInt(),
      event.callvalue.toBigInt(),
      event.data as Hex
    ]
  });

  return { from: params.account, to: address, data };
};

// export const getWithdrawals = async (params: {
//   parent: IChainId;
//   child: IChainId;
//   address: Address;
// }) => {
//   const [nativeWithdrawals, erc20Withdrawals] = await Promise.all([
//     getNativeWithdrawals(params),
//     getERC20withdrawals(params)
//   ]);

//   const withdrawals = nativeWithdrawals
//     .concat(erc20Withdrawals)
//     .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

//   return withdrawals;
// };

// export const getERC20withdrawals = async (params: {
//   parent: IChainId;
//   child: IChainId;
//   address: Address;
// }) => {
//   const parentClient = getPublicClient(params.parent);
//   const parentProvider = clientToProvider(parentClient);
//   const parentNetwork = await getArbitrumNetwork(parentProvider);
//   const parentGatewayAddress = parentNetwork.tokenBridge
//     ?.parentErc20Gateway as Address;

//   const events = await parentClient
//     .getContractEvents({
//       address: parentGatewayAddress,
//       abi: erc20gateway.abi,
//       eventName: 'DepositInitiated',
//       args: { _from: params.address, _to: params.address },
//       strict: true
//     })
//     .then((list) => list.slice(0, 20));

//   const output: {
//     type: 'deposit';
//     token: Address;
//     amount: string;
//     createdAt: string;
//     parentSignature: Hex;
//     childSignature?: Hex;
//   }[] = [];

//   for (const event of events) {
//     // const parentToken = event.args.l1Token;
//     // const [block, decimals, receipt] = await Promise.all([
//     //   parentClient.getBlock({
//     //     blockNumber: event.blockNumber,
//     //     includeTransactions: false
//     //   }),
//     //   getContract({
//     //     abi: erc20Abi,
//     //     address: event.args.l1Token,
//     //     client: parentClient
//     //   }).read.decimals(),
//     //   getDepositReceipt({
//     //     ...params,
//     //     parentToken,
//     //     parentSignature: event.transactionHash
//     //   })
//     // ]);
//     // output.push({
//     //   type: 'deposit',
//     //   token: parentToken,
//     //   amount: new Big(event.args._amount.toString())
//     //     .div(10 ** decimals)
//     //     .toFixed(decimals),
//     //   createdAt: new Date(
//     //     new Big(block.timestamp.toString()).mul(1000).toFixed(0)
//     //   ).toISOString(),
//     //   parentSignature: event.transactionHash,
//     //   childSignature: receipt.childSignature
//     // });
//   }

//   return output;
// };

// export const getNativeDeposits = async (params: {
//   parent: IChainId;
//   child: IChainId;
//   address: Address;
// }) => {
//   const childClient = getPublicClient(params.child);
//   const parentClient = getPublicClient(params.parent);
//   const childProvider = clientToProvider(childClient);
//   const parentProvider = clientToProvider(parentClient);
//   const parentNetwork = await getArbitrumNetwork(parentProvider);
//   const parentErc20Inbox = parentNetwork.ethBridge.inbox as Address;
//   const childNetwork = await getArbitrumNetwork(childProvider);
//   const nativeToken = childNetwork.nativeToken as Address;

//   const events = await parentClient
//     .getContractEvents({
//       address: nativeToken,
//       abi: erc20Abi,
//       eventName: 'Transfer',
//       args: { from: params.address, to: parentErc20Inbox },
//       strict: true
//     })
//     .then((list) => list.slice(0, 20));

//   const output: {
//     type: 'deposit';
//     token: Address;
//     amount: string;
//     createdAt: string;
//     parentSignature: Hex;
//     childSignature?: Hex;
//   }[] = [];

//   for (const event of events) {
//     const [block, decimals, receipt] = await Promise.all([
//       parentClient.getBlock({
//         blockNumber: event.blockNumber,
//         includeTransactions: false
//       }),
//       18, // all gas tokens are 18
//       getDepositReceipt({
//         ...params,
//         parentToken: nativeToken,
//         parentSignature: event.transactionHash
//       })
//     ]);

//     output.push({
//       type: 'deposit',
//       token: nativeToken,
//       amount: new Big(event.args.value.toString())
//         .div(10 ** decimals)
//         .toFixed(decimals),
//       createdAt: new Date(
//         new Big(block.timestamp.toString()).mul(1000).toFixed(0)
//       ).toISOString(),
//       parentSignature: event.transactionHash,
//       childSignature: receipt.childSignature
//     });
//   }

//   return output;
// };

// export const getDepositReceipt = async (params: {
//   parent: IChainId;
//   child: IChainId;
//   parentToken: Address;
//   parentSignature: Hex;
// }) => {
//   const childProvider = clientToProvider(getPublicClient(params.child));
//   const parentProvider = clientToProvider(getPublicClient(params.parent));
//   const childNetwork = await getArbitrumNetwork(childProvider);
//   const nativeToken = childNetwork.nativeToken?.toLowerCase();
//   const erc20ParentAddress = params.parentToken.toLowerCase();
//   const isNativeToken = erc20ParentAddress === nativeToken;
//   const txReceipt = await parentProvider.getTransactionReceipt(
//     params.parentSignature
//   );

//   if (isNativeToken) {
//     return new ParentEthDepositTransactionReceipt(txReceipt)
//       .waitForChildTransactionReceipt(childProvider)
//       .then(({ complete, childTxReceipt }) => ({
//         complete,
//         childSignature: childTxReceipt?.transactionHash as Hex | undefined
//       }));
//   } else {
//     return new ParentContractCallTransactionReceipt(txReceipt)
//       .waitForChildTransactionReceipt(childProvider)
//       .then((res) => ({
//         complete: res.complete,
//         childSignature:
//           'childTxReceipt' in res
//             ? (res.childTxReceipt.transactionHash as Hex)
//             : undefined
//       }));
//   }
// };

/**
    For withdrawing Native Token (EDU), we monitor:
    ArbSys (0x0000000000000000000000000000000000000064)
    withdrawEth(address destination)
    (My Wallet Addy)
    https://educhain.blockscout.com/tx/0x44908fa587a57090a660759dee22148ba582d7a6d2cc5b8cf0ee01c5bc193dc5

    For withdrawing ERC20, we monitor:
    L2GatewayRouter (0xFd25B25576cC0d510F62C88A166F84b3e25208C7)
    outboundTransfer(address _l1Token, address _to, uint256 _amount, bytes _data)
    (Parent USDC address, My Wallet Addy, amount, 0x)
    https://educhain.blockscout.com/tx/0x67e512ff326d5431d0e2c03d2aa3197f621542a6c4800e6ce63de93c3fb7efda
 */

export const getWithdrawalReceipt = async (params: {
  parent: IChainId;
  child: IChainId;
  parentToken: Address;
  childSignature: Hex;
}) => {
  const childProvider = clientToProvider(getPublicClient(params.child));
  const parentProvider = clientToProvider(getPublicClient(params.parent));
  const childNetwork = await getArbitrumNetwork(childProvider);
  const nativeToken = childNetwork.nativeToken?.toLowerCase();
  const erc20ParentAddress = params.parentToken.toLowerCase();
  const isNativeToken = erc20ParentAddress === nativeToken;
  const txReceipt = await childProvider.getTransactionReceipt(
    params.childSignature
  );

  return new ChildTransactionReceipt(txReceipt).isDataAvailable(childProvider);
};

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
