import axios from 'axios';
import { blockscoutApiUrl, whitelistedTokens } from './constant';
import { formatEther } from 'viem';
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
  next_page_params?: {
    address_hash: string;
    items_count: number;
    value: number;
  } | null;
}

export async function* getTokenHoldersGenerator() {
  let nextPageParams: any = null;
  let pageCount = 1;
  
  do {
    const url = `${blockscoutApiUrl}/tokens/${whitelistedTokens[0]}/holders`;
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json'
      },
      params: nextPageParams
    });
    
    const holders: TokenHoldersResponse = response.data;
    
    console.log(`Fetching page ${pageCount}, got ${holders.items.length} holders`);
    
    // Process and yield each holder
    for (const item of holders.items) {
      const formattedValue = formatEther(BigInt(item.value));
      
      yield {
        address: item.address.hash,
        token: `${item.token.name} (${item.token.symbol})`,
        value: formattedValue,
        rawValue: item.value
      };
    }
    
    nextPageParams = holders.next_page_params;
    pageCount++;
    
  } while (nextPageParams);
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
  
  const holders = response.data;
  
  // Log the data in a readable format
  holders.items.forEach((item: TokenHolder) => {
    const decimals = parseInt(item.token.decimals);
    const formattedValue = formatEther(BigInt(item.value));
    
    // console.log(`Address: ${item.address.hash}`);
    // console.log(`Token: ${item.token.name} (${item.token.symbol})`);
    // console.log(`Value: ${formattedValue} ${item.token.symbol}`);
    console.log(`Next page params: ${JSON.stringify(holders.next_page_params)}`);
    console.log('-------------------');
  });
  
  return holders;
};