import axios from 'axios';
import fs from 'fs';
import { formatEther } from 'viem';
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
  next_page_params?: {
    address_hash: string;
    items_count: number;
    value: number;
  } | null;
}

// New interface for aggregated holder data
interface HolderAggregatedData {
  address: string;
  holdings: {
    [tokenSymbol: string]: {
      amount: string;
      value: number;
    }
  };
  totalValue: number;
}

// Process token holders and return aggregated data
// Process token holders and return aggregated data
export const processTokenHolders = async (
  outputCsv?: string, 
  maxPages: number = 1, // for testing, set to 5
  minThreshold: number = 0.0000001 // 1 token as minimum threshold
): Promise<Map<string, HolderAggregatedData>> => {
  console.log('\n===== Processing Token Holders for TVL Calculation =====');
  
  // Map to store aggregated data by address
  const holdersMap = new Map<string, HolderAggregatedData>();
  let totalProcessed = 0;
  let filteredOut = 0;
  
  // Process each whitelisted token
  for (const token of whitelistedTokens) {
    console.log(`\n===== Processing token: ${token.name} (${token.symbol}) =====`);
    console.log(`Token address: ${token.address}`);
    
    let nextPageParams: any = null;
    let pageCount = 1;
    let processedCount = 0;

    do {
      const response = await axios.get(
        `${blockscoutApiUrl}/tokens/${token.address}/holders`,
        {
          headers: {
            accept: 'application/json'
          },
          params: nextPageParams
        }
      );

      const holders: TokenHoldersResponse = response.data;
      processedCount += holders.items.length;
      totalProcessed += holders.items.length;

      console.log(
        `Fetching page ${pageCount} for ${token.symbol}, got ${holders.items.length} holders (processed ${processedCount} so far)`
      );

      // Process each holder
      for (const item of holders.items) {
        const address = item.address.hash;
        const formattedValue = formatEther(BigInt(item.value));
        const numericValue = parseFloat(formattedValue);
        
        // Skip dust amounts
        if (numericValue < minThreshold) {
          filteredOut++;
          continue;
        }
        
        const tokenValue = numericValue * token.value;
        
        // Get or create holder record
        if (!holdersMap.has(address)) {
          holdersMap.set(address, {
            address,
            holdings: {},
            totalValue: 0
          });
        }
        
        const holderData = holdersMap.get(address)!;
        
        // Add token holding
        holderData.holdings[token.symbol] = {
          amount: formattedValue,
          value: tokenValue
        };
        
        // Update total value
        holderData.totalValue = Object.values(holderData.holdings)
          .reduce((sum, holding) => sum + holding.value, 0);
      }

      nextPageParams = holders.next_page_params;
      pageCount++;
      
      // Limit to maxPages for testing
      if (pageCount > maxPages) {
        console.log(`Reached maximum page limit (${maxPages}) for testing`);
        break;
      }
    } while (nextPageParams);
    
    console.log(`Completed processing ${token.symbol}: found ${processedCount} holders`);
    console.log(`=================================================\n`);
  }
  
  console.log(`Total processed: ${totalProcessed} holder records`);
  console.log(`Filtered out ${filteredOut} dust amounts (below ${minThreshold})`);
  console.log(`Unique addresses with significant holdings: ${holdersMap.size}`);
  
  // Generate CSV if requested
  if (outputCsv) {
    generateCsvReport(holdersMap, outputCsv);
  }
  
  return holdersMap;
};
// Generate CSV report from holder data
export const generateCsvReport = (
  holdersMap: Map<string, HolderAggregatedData>, 
  outputPath: string
): void => {
  console.log(`\n===== Generating TVL CSV Report =====`);
  
  // Convert map to array and sort by total value (descending)
  const holders = Array.from(holdersMap.values())
    .sort((a, b) => b.totalValue - a.totalValue);
  
  // Generate CSV header
  const tokenColumns = whitelistedTokens.flatMap(token => [
    `${token.symbol}_amount`,
    `${token.symbol}_value`
  ]);
  
  const header = ['address', ...tokenColumns, 'total_usd_value'].join(',');
  
  // Generate CSV rows
  const rows = holders.map(holder => {
    const values = [holder.address];
    
    // Add token amounts and values
    for (const token of whitelistedTokens) {
      const holding = holder.holdings[token.symbol];
      values.push(holding ? holding.amount : '0');
      values.push(holding ? holding.value.toString() : '0');
    }
    
    // Add total USD value
    values.push(holder.totalValue.toString());
    
    return values.join(',');
  });
  
  // Combine header and rows
  const csv = [header, ...rows].join('\n');
  
  // Write to file
  fs.writeFileSync(outputPath, csv);
  console.log(`TVL report written to ${outputPath}`);
};

// Also update the generator function for consistency
export async function* getTokenHoldersGenerator(maxPages: number = Infinity) {
  // Process each whitelisted token
  for (const token of whitelistedTokens) {
    console.log(`\n===== Processing token: ${token.name} (${token.symbol}) =====`);
    console.log(`Token address: ${token.address}`);
    
    let nextPageParams: any = null;
    let pageCount = 1;
    let tokenHolderCount = 0;
    let processedCount = 0;

    do {
      const response = await axios.get(
        `${blockscoutApiUrl}/tokens/${token.address}/holders`,
        {
          headers: {
            accept: 'application/json'
          },
          params: nextPageParams
        }
      );

      const holders: TokenHoldersResponse = response.data;
      processedCount += holders.items.length;

      console.log(
        `Fetching page ${pageCount} for ${token.symbol}, got ${holders.items.length} holders (processed ${processedCount} so far)`
      );

      // Process and yield each holder
      for (const item of holders.items) {
        const formattedValue = formatEther(BigInt(item.value));
        tokenHolderCount++;

        yield {
          address: item.address.hash,
          token: `${item.token.name} (${item.token.symbol})`,
          tokenAddress: token.address,
          tokenSymbol: token.symbol,
          value: formattedValue,
          rawValue: item.value
        };
      }

      nextPageParams = holders.next_page_params;
      pageCount++;
      
      // Limit to maxPages for testing
      if (pageCount > maxPages) {
        console.log(`Reached maximum page limit (${maxPages}) for testing`);
        break;
      }
    } while (nextPageParams);
    
    console.log(`Completed processing ${token.symbol}: found ${tokenHolderCount} total holders`);
    console.log(`=================================================\n`);
  }
}

// Keep the original getTokenHolders function for backward compatibility
export const getTokenHolders = async (): Promise<TokenHoldersResponse[]> => {
  const allHolders: TokenHoldersResponse[] = [];
  
  for (const token of whitelistedTokens) {
    console.log(`\n===== Processing token: ${token.name} (${token.symbol}) =====`);
    console.log(`Token address: ${token.address}`);
    
    const response = await axios.get(
      `${blockscoutApiUrl}/tokens/${token.address}/holders`,
      {
        headers: {
          accept: 'application/json'
        }
      }
    );

    const holders = response.data;
    allHolders.push(holders);

    console.log(`Found ${holders.items.length} holders for ${token.symbol}`);
    
    // Log the data in a readable format
    holders.items.forEach((item: TokenHolder) => {
      console.log(`Next page params: ${JSON.stringify(holders.next_page_params)}`);
      console.log('-------------------');
    });
    
    console.log(`=================================================\n`);
  }

  return allHolders;
};
