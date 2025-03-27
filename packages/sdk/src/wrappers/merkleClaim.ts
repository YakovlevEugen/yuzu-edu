import { getContract, parseAbiItem } from 'viem';
import { abi } from '../abi/OCPointMerkleClaim';
import type { IChainId } from '../chains';
import { getPublicClient } from '../clients';
import { getMerkeClaimAddress } from '../helpers';

export const getMerkleClaimContract = (chainId: IChainId) =>
  getContract({
    client: getPublicClient(chainId),
    address: getMerkeClaimAddress(chainId),
    abi
  });

export const getMerkleClaimLogs = (params: {
  chainId: IChainId;
  fromBlock: bigint;
  toBlock: bigint;
  rpcUrl: string;
}) => {
  const { chainId, fromBlock, toBlock, rpcUrl } = params;
  return getPublicClient(chainId, rpcUrl)
    .getLogs({
      address: getMerkeClaimAddress(chainId),
      event: parseAbiItem(
        'event PayoutClaimed(bytes32 indexed root, address indexed recipient, uint256[] amounts, bytes32[] depositReasonCodes, uint256 treeCounter)'
      ),
      strict: true,
      fromBlock,
      toBlock
    })
    .then((logs) => logs.filter((l) => !l.removed));
};
