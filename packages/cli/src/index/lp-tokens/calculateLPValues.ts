import fs from 'fs';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import { calculatePositionValue } from './calculatePositionValue';
interface LPHolder {
  address: string;
  token_id: string;
  lp: string;
  contractAddress: string;
}

interface AddressValue {
  address: string;
  total_usd_value: number;
}

export async function calculateLPValues() {
  const holders: LPHolder[] = [];
  const addressValues: Map<string, number> = new Map();
  
  // Read the CSV file
  await new Promise<void>((resolve) => {
    fs.createReadStream('lpholders.csv')
      .pipe(csv())
      .on('data', (data: LPHolder) => {
        holders.push(data);
      })
      .on('end', () => {
        resolve();
      });
  });

  console.log(`Processing ${holders.length} LP positions...`);
  
  // Process each LP position
  for (let i = 0; i < holders.length; i++) {
    const holder = holders[i];
    try {
      console.log(`Processing position ${i+1}/${holders.length}: Address ${holder.address}, Token ID ${holder.token_id}`);
      
      // Calculate the position value
      const positionValue = await calculatePositionValue(
        holder.contractAddress,
        Number(holder.token_id)
      );
      
      // Add to the address's total value
      const currentValue = addressValues.get(holder.address) || 0;
      addressValues.set(holder.address, currentValue + positionValue);
      
      console.log(`Position value: $${positionValue}`);
    } catch (error) {
      console.error(`Error processing position for ${holder.address}, token ID ${holder.token_id}:`, error);
    }
  }
  
  // Convert the map to an array for CSV writing
  const results: AddressValue[] = Array.from(addressValues.entries()).map(([address, value]) => ({
    address,
    total_usd_value: value
  }));
  
  // Sort by total value (highest first)
  results.sort((a, b) => b.total_usd_value - a.total_usd_value);
  
  // Write the results to a CSV file
  const csvWriter = createObjectCsvWriter({
    path: 'lp_values.csv',
    header: [
      { id: 'address', title: 'address' },
      { id: 'total_usd_value', title: 'total_usd_value' }
    ]
  });
  
  await csvWriter.writeRecords(results);
  console.log(`Results written to lp_values.csv`);
  
  // Log some statistics
  const totalValue = results.reduce((sum, item) => sum + item.total_usd_value, 0);
  console.log(`Total LP value across all addresses: $${totalValue.toFixed(2)}`);
  console.log(`Number of unique addresses: ${results.length}`);
}

// Run the function
calculateLPValues().catch(error => {
  console.error('Error in main process:', error);
});