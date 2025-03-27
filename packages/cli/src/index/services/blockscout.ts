import Big from 'big.js';
import { type Address, type Hex, getAddress } from 'viem';
import { sleep } from '../helpers';

export const blockscoutUrl = 'https://educhain.blockscout.com/api/v2';

/**
 * Get Wallet details
 */

export async function fetchWalletDetails(address: Address) {
  const result = await fetch(`${blockscoutUrl}/addresses/${address}`).then(
    (res) => res.json() as Promise<IWalletDetails>
  );

  return result;
}

/**
 * Get Token Transfers
 */

export async function* fetchTokenTransfers(
  address: Address,
  _nextPageParams?: ITokenTransferNextPageParams
) {
  let nextPageParams = _nextPageParams;

  do {
    const params: string = nextPageParams
      ? new URLSearchParams(
          nextPageParams as unknown as Record<string, string>
        ).toString()
      : '';

    console.log(`GET ${blockscoutUrl}/tokens/${address}/transfers?${params}`);

    const page = await fetch(
      `${blockscoutUrl}/tokens/${address}/transfers?${params}`
    ).then(async (res) => {
      if (res.ok) {
        return res.json() as Promise<ITokenTransferResponse>;
      } else {
        console.log(res.status, res.statusText, await res.text());
        throw new Error('unknown format');
      }
    });

    for (const item of page.items) {
      yield {
        from: item.from.hash,
        to: item.to.hash,
        txHash: item.transaction_hash,
        // txIndex: 0, // NOTE: missing this data
        logIndex: item.log_index,
        blockHash: item.block_hash,
        blockNumber: item.block_number,
        blockTimestamp: item.timestamp,
        token: item.token.address,
        amount: item.total.value,
        nextPageParams: page.next_page_params
      };
    }

    nextPageParams = page.next_page_params;
  } while (nextPageParams);
}

/**
 * Get Native Token Holders Addresses & Balances
 */

export async function* fetchNativeTokenHolders(threshold: number) {
  let nextPageParams: Record<string, string> | undefined = undefined;

  do {
    const params: string = nextPageParams
      ? new URLSearchParams(nextPageParams).toString()
      : '';

    const page = await fetch(`${blockscoutUrl}/addresses?${params}`).then(
      (res) => res.json() as Promise<INativeBalanceResponse>
    );

    for (const item of page.items) {
      const amount = Big(item.coin_balance).div(1e18).toFixed(undefined, 0);

      if (new Big(amount).lt(threshold)) return;
      if (item.is_contract) continue;

      yield {
        wallet: getAddress(item.hash),
        amount
      };
    }

    nextPageParams = page.next_page_params;
  } while (nextPageParams);
}

/**
 * Get Wallet Txs
 */

export async function* fetchWalletTxs(address: Address, token: Address) {
  let nextPageParams: ITokenTransferNextPageParams | undefined = undefined;

  do {
    const params: string = nextPageParams
      ? new URLSearchParams(
          nextPageParams as unknown as Record<string, string>
        ).toString()
      : '';

    const page = await fetch(
      `${blockscoutUrl}/addresses/${address}/token-transfers?token=${token}&${params}`
    ).then((res) => res.json() as Promise<ITokenTransferResponse>);

    for (const item of page.items) {
      yield {
        from: item.from.hash,
        to: item.to.hash,
        txHash: item.transaction_hash,
        // txIndex: 0, // NOTE: missing this data
        logIndex: item.log_index,
        blockHash: item.block_hash,
        blockNumber: item.block_number,
        blockTimestamp: item.timestamp,
        token: item.token.address,
        amount: item.total.value,
        nextPageParams: page.next_page_params
      };
    }

    await sleep(0.1);

    console.log(address, page.next_page_params);

    nextPageParams = page.next_page_params;
  } while (nextPageParams);
}

/**
 * Get ERC20 Token Holders Addresses & Balances
 */

export async function* fetchBlocks() {
  let nextPageParams: Record<string, string> | undefined = undefined;

  do {
    const params: string = nextPageParams
      ? new URLSearchParams(nextPageParams).toString()
      : '';

    const page = await fetch(`${blockscoutUrl}/blocks?${params}`).then(
      (res) => res.json() as Promise<IBlocksResponse>
    );

    for (const item of page.items) {
      yield {
        blockNumber: item.height,
        blockTimestamp: item.timestamp
      };
    }

    nextPageParams = page.next_page_params;
  } while (nextPageParams);
}

/**
 * Get ERC20 Token Holders Addresses & Balances
 */

export async function* fetchTokenHolders(
  tokenAddress: Address,
  threshold?: number
) {
  let nextPageParams: Record<string, string> | undefined = undefined;

  do {
    const params: string = nextPageParams
      ? new URLSearchParams(nextPageParams).toString()
      : '';

    const page = await fetch(
      `${blockscoutUrl}/tokens/${tokenAddress}/holders?${params}`
    ).then((res) => res.json() as Promise<ITokenHoldersResponse>);

    for (const item of page.items) {
      const amount = new Big(item.value)
        .div(10 ** parseInt(item.token.decimals))
        .toFixed(undefined, 0);

      if (threshold && new Big(amount).lt(threshold)) return;
      if (item.address.is_contract) continue;

      yield {
        wallet: getAddress(item.address.hash),
        amount
      };
    }

    nextPageParams = page.next_page_params;
  } while (nextPageParams);
}

/**
 * Get LP Token Holders Addresses
 */

export async function* fetchNFTHolders(nftAddress: Address) {
  let nextPageParams: Record<string, string> | undefined = undefined;

  do {
    const params: string = nextPageParams
      ? new URLSearchParams(nextPageParams).toString()
      : '';

    const page = await fetch(
      `${blockscoutUrl}/tokens/${nftAddress}/instances?${params}`
    ).then((res) => res.json() as Promise<INFTHoldersResponse>);

    for (const item of page.items) {
      if (item.owner.is_contract) continue;

      yield {
        wallet: getAddress(item.owner.hash),
        tokenId: item.id
      };
    }

    nextPageParams = page.next_page_params;
  } while (nextPageParams);
}

/**
 * Types
 */

export type IBalance = { wallet: Address; amount: string };
export type INFTBalance = { wallet: Address; tokenId: string };

type INativeBalanceResponse = {
  items: {
    hash: Address;
    coin_balance: string;
    is_contract: boolean;
  }[];
  next_page_params?: Record<string, string>;
};

type ITokenHoldersResponse = {
  items: {
    address: { hash: Address; is_contract: boolean };
    token: { decimals: string };
    value: string;
  }[];
  next_page_params?: Record<string, string>;
};

type INFTHoldersResponse = {
  items: {
    id: string;
    owner: { hash: Address; is_contract: boolean };
  }[];
  next_page_params?: Record<string, string>;
};

type IWalletDetails = {
  block_number_balance_updated_at: number;
  coin_balance: string;
  has_token_transfers: boolean;
  has_tokens: boolean;
  has_validated_blocks: false;
  hash: Address;
  is_contract: boolean;
};

type ITokenTransferResponse = {
  items: {
    block_hash: Hex;
    block_number: number;
    from: {
      hash: Address; // address_0, eoa, contract
      is_contract: boolean;
    };
    log_index: number;
    method: string; // deposit, withdraw, transfer
    timestamp: string; // iso8601
    to: {
      hash: Address; // address_0, eoa, contract;
      is_contract: boolean;
    };
    token: { address: Address };
    total: {
      decimals: string; //'18';
      value: string; // '250000000000000000000';
    };
    transaction_hash: Hex;
    type: string; // 'token_minting' / buring? transfer?;
  }[];
  next_page_params?: ITokenTransferNextPageParams;
};

export type ITokenTransfer = {
  from: Address;
  to: Address;
  txHash: Hex;
  logIndex: number;
  blockHash: Hex;
  blockNumber: number;
  blockTimestamp: string;
  token: Address;
  amount: string;
};

export type ITokenTransferNextPageParams = {
  block_number: number;
  index: number;
};

export type IBlocksResponse = {
  items: {
    hash: string;
    height: number;
    timestamp: string;
  }[];
  next_page_params?: Record<string, string>;
};
