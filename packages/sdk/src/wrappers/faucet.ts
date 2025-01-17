import { faucet } from '@yuzu/contracts';
import {
  type Address,
  type Hex,
  type PrivateKeyAccount,
  encodeFunctionData,
  getContract
} from 'viem';
import type { IChainId } from '../chains';
import { getPublicClient, getWalletClient } from '../clients';
import { getFaucetAddress } from '../helpers';
import type { ITxRequest } from '../requests';

export const getFaucetContract = (chainId: IChainId) =>
  getContract({
    client: getPublicClient(chainId),
    address: getFaucetAddress(chainId),
    abi: faucet.abi
  });

export const getFaucetLogs = (params: {
  chainId: IChainId;
  fromBlock: bigint;
  toBlock: bigint;
}) => {
  const { chainId, fromBlock, toBlock } = params;
  const { address, abi } = getFaucetContract(chainId);
  return getPublicClient(chainId).getContractEvents({
    address,
    abi,
    fromBlock,
    toBlock,
    strict: true
  });
};

export const claim = async (params: {
  chainId: IChainId;
  account: Address;
  signer: PrivateKeyAccount;
}): Promise<ITxRequest> => {
  const { chainId, account, signer } = params;
  const contract = getFaucetContract(chainId);
  const hash = await contract.read.getWithdrawalHash([account]);
  const signature = await signer.sign({ hash });
  const data = encodeFunctionData({
    functionName: 'claim',
    abi: contract.abi,
    args: [signature]
  });
  return { from: account, to: contract.address, data };
};

export const claimTo = async (params: {
  chainId: IChainId;
  account: Address;
  signer: PrivateKeyAccount;
  nonce: number;
}): Promise<Hex> => {
  const { chainId, account, signer, nonce } = params;
  const contract = getFaucetContract(chainId);
  const wallet = getWalletClient(chainId, signer);

  const signature = await wallet.sendTransaction({
    from: signer.address,
    to: contract.address,
    data: encodeFunctionData({
      functionName: 'claimTo',
      abi: contract.abi,
      args: [account]
    }),
    nonce
  });

  return signature;
};

export const hasClaimed = async (params: {
  chainId: IChainId;
  account: Address;
}): Promise<boolean> => {
  const { chainId, account } = params;
  const contract = getFaucetContract(chainId);
  return contract.read.claimed([account]);
};
