import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { blockscoutApiUrl, whitelistedLPs } from '../../tvl-calculation/constant';

// Define interfaces for the API response
interface TokenOwner {
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
  decimals: string | null;
  exchange_rate: string | null;
  holders: string;
  icon_url: string | null;
  name: string;
  symbol: string;
  total_supply: string;
  type: string;
  volume_24h: string | null;
}

interface TokenInstance {
  animation_url: string | null;
  external_app_url: string | null;
  id: string;
  image_url: string | null;
  is_unique: boolean;
  media_type: string | null;
  media_url: string | null;
  metadata: any | null;
  owner: TokenOwner;
  thumbnails: any | null;
  token: TokenInfo;
}

interface TokenInstancesResponse {
  items: TokenInstance[];
  next_page_params?: {
    items_count: number;
    token_id: string;
  } | null;
}

/**
 * Fetches LP token holders data and saves it to a CSV file
 * @param outputPath Path to save the CSV file
 * @param maxPages Maximum number of pages to fetch (for testing)
 */
export const ingestLPHoldersData = async (
  outputPath: string = './lpholders.csv',
  maxPages: number = 1000
): Promise<void> => {
  console.log('\n===== Processing LP Token Holders =====');
  
  // Array to store all holder data
  const holderData: { address: string; token_id: string; lp: string ; lpAddress: string}[] = [];
  
  // Process each whitelisted LP token
  for (const lpToken of whitelistedLPs) {
    if (!lpToken.address) continue; // Skip if address is not defined
    
    console.log(`\n===== Processing LP token: ${lpToken.name} (${lpToken.symbol}) =====`);
    console.log(`Token address: ${lpToken.address}`);
    
    let nextPageParams: any = null;
    let pageCount = 1;
    let processedCount = 0;

    do {
      try {
        const response = await axios.get(
          `${blockscoutApiUrl}/tokens/${lpToken.address}/instances`,
          {
            headers: {
              accept: 'application/json'
            },
            params: nextPageParams
          }
        );

        const instances: TokenInstancesResponse = response.data;
        processedCount += instances.items.length;

        console.log(
          `Fetching page ${pageCount} for ${lpToken.symbol}, got ${instances.items.length} instances (processed ${processedCount} so far)`
        );

        // Process each token instance
        for (const item of instances.items) {
          if (item.owner.hash === '0x0000000000000000000000000000000000000000') continue;

          holderData.push({
            address: item.owner.hash,
            token_id: item.id,
            lp: lpToken.symbol,
            lpAddress: lpToken.address
          });
        }

        nextPageParams = instances.next_page_params;
        pageCount++;
        
        // Limit to maxPages for testing
        if (pageCount > maxPages) {
          console.log(`Reached maximum page limit (${maxPages}) for testing`);
          break;
        }
      } catch (error) {
        console.error(`Error fetching data for ${lpToken.symbol}:`, error);
        break;
      }
    } while (nextPageParams);
    
    console.log(`Completed processing ${lpToken.symbol}: found ${processedCount} token instances`);
    console.log(`=================================================\n`);
  }
  
  // Generate CSV
  const csvHeader = 'address,token_id,lp,contractAddress';
  const csvRows = holderData.map(row => 
    `${row.address},${row.token_id},${row.lp},${row.lpAddress}`
  );
  
  const csvContent = [csvHeader, ...csvRows].join('\n');
  
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Write to file
  fs.writeFileSync(outputPath, csvContent);
  console.log(`LP holders data written to ${outputPath}`);
  console.log(`Total LP token instances processed: ${holderData.length}`);
};

// Add a command to the CLI


