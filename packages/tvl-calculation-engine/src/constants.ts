import axios from 'axios';

interface TokenHolderAddress {
  hash: string;
  implementation_name?: string;
  name?: string;
  ens_domain_name?: string;
  metadata?: {
    slug: string;
    name: string;
    tagType: string;
    ordinal: number;
    meta: Record<string, unknown>;
  };
  is_contract: boolean;
  private_tags?: Array<{
    address_hash: string;
    display_name: string;
    label: string;
  }>;
  watchlist_names?: Array<{
    display_name: string;
    label: string;
  }>;
  public_tags?: Array<{
    address_hash: string;
    display_name: string;
    label: string;
  }>;
  is_verified: boolean;
}

interface Token {
  circulating_market_cap: string;
  icon_url: string;
  name: string;
  decimals: string;
  symbol: string;
  address: string;
  type: string;
  holders: string;
  exchange_rate: string;
  total_supply: string;
}

interface TokenHolder {
  address: TokenHolderAddress;
  value: string;
  token_id: string;
  token: Token;
}

interface TokenHoldersResponse {
  items: TokenHolder[];
  next_page_params?: {
    items_count: number;
    value: number;
  };
}

export const getTokenHolders = async (
  tokenAddress: string
): Promise<TokenHoldersResponse> => {
  const response = await axios.get<TokenHoldersResponse>(
    `https://educhain.blockscout.com/api/v2/tokens/${tokenAddress}/holders`,
    {
      headers: {
        accept: 'application/json'
      }
    }
  );
  return response.data;
};

export const whitelistedTokens = [
  '0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12', // WRAPPED EDU
  '0x836d275563bAb5E93Fd6Ca62a95dB7065Da94342' // USDC COIN
];
