import Big from 'big.js';
import { type Address, getAddress } from 'viem';

export const blockscoutUrl = 'https://educhain.blockscout.com/api/v2';

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
 * Get ERC20 Token Holders Addresses & Balances
 */

export async function* fetchTokenHolders(tokenAddress: Address) {
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
