import axios from 'axios';
import { blockscoutApiUrl, whitelistedTokens } from './constant';

// Define interfaces for the API response
interface AddressInfo {
  ens_domain_name: string | null;
  hash: string;
  implementations: any[];
  is_contract: boolean;
  is_scam: boolean;
  is_verified: boolean;
  metadata: any | null;
  name: string | null;
  private_tags: any[];
  proxy_type: string | null;
  public_tags: any[];
  watchlist_names: any[];
}

interface TokenInfo {
  address: string;
  circulating_market_cap: string | null;
  decimals: string;
  exchange_rate: string | null;
  holders: string;
  icon_url: string | null;
  name: string;
  symbol: string;
  total_supply: string;
  type: string;
  volume_24h: string | null;
}

interface TokenHolder {
  address: AddressInfo;
  token: TokenInfo;
  token_id: string | null;
  value: string;
}

interface TokenHoldersResponse {
  items: TokenHolder[];
}

export const getTokenHolders = async (): Promise<TokenHoldersResponse> => {
  const response = await axios.get(
    `${blockscoutApiUrl}/tokens/${whitelistedTokens[0]}/holders`,
    {
      headers: {
        accept: 'application/json'
      }
    }
  );
  
  // Return formatted data to avoid [Object] in console output
  const holders = response.data;
  
  // Log the data in a readable format

  // Return the actual data
  return holders;
};