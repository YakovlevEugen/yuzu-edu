import type { BigNumberish, BytesLike } from 'ethers';
import { type Hex, toHex } from 'viem';

export type ITxRequest = {
  from?: Hex;
  to: Hex;
  data: Hex;
  value?: bigint;
};

export const toHexString = (bytes: BytesLike): Hex => {
  if (typeof bytes === 'string') return bytes as Hex;
  return toHex(new Uint8Array(bytes));
};

export const encodeTxRequest = (req: {
  from: string;
  to: string;
  data: BytesLike;
  value?: BigNumberish;
}) =>
  JSON.stringify({
    from: req.from,
    to: req.to,
    data: toHexString(req.data),
    value: req.value?.toString()
  });

export const decodeTxRequest = (msg: string): ITxRequest => {
  const payload = JSON.parse(msg);
  return {
    from: payload.from as Hex | undefined,
    to: payload.to as Hex,
    data: payload.data as Hex,
    value: payload.value ? BigInt(payload.value) : undefined
  };
};

// export const deposit = async (params: {
//   parent: IChainId;
//   child: IChainId;
//   parentToken: Hex;
//   amount: string;
//   account: Address;
//   // parentSigner: WalletClient<Transport, Chain, Account>;
// }): Promise<ITxRequest> => {
//   // const parentProvider = clientToProvider(getPublicClient(params.parent));
//   // const parentSigner = clientToSigner(params.parentSigner);
//   const { approveGasToken, approveErc20Token, depositRequest } =
//     await getDepositRequest({ ...params, from: params.account });

//   depositRequest.txRequest.value;
//   // return parentSigner.sendTransaction(request.txRequest);
//   // const { txRequest } = request;
//   return {
//     from: txRequest.from as Hex,
//     to: txRequest.to as Hex,
//     data: toHexString(txRequest.data),
//     value: BigInt(txRequest.value.toString())
//   };
// };

// export const withdraw = async (params: {
//   parent: IChainId;
//   child: IChainId;
//   parentToken: Hex;
//   amount: string;
//   account: Address;
// }): Promise<ITxRequest> => {
//   const parentProvider = clientToProvider(getPublicClient(params.parent));
//   // const childSigner = clientToSigner(getWalletClient(params.child));
//   // const childProvider = clientToProvider(getPublicClient(params.child));
//   const request = await getWithdrawRequest(params);
//   const { txRequest, estimateParentGasLimit } = request;
//   // return childSigner.sendTransaction(txRequest);
//   const gasLimit = await estimateParentGasLimit(parentProvider);
//   // const parentGasLimit = gasLimit.toString();
//   return {
//     from: txRequest.from as Hex,
//     to: txRequest.to as Hex,
//     data: toHexString(txRequest.data),
//     value: BigInt(txRequest.value.toString())
//   };
// };
