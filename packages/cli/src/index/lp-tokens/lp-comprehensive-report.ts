import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { createObjectCsvWriter } from 'csv-writer';
import { calculatePositionValue } from './calculatePositionValue';

interface LPHolder {
  address: string;
  token_id: string;
  lp: string;
  contractAddress: string;
}

interface DetailedPositionValue {
  address: string;
  token_id: string;
  contract_name: string;
  usd_value: number;
}

export async function generateLPComprehensiveReport(outputPath: string) {
  const holders: LPHolder[] = [];
  
  // Load the LP holders data from the CSV file
  const csvData = fs.readFileSync('./output/lpholders.csv', 'utf8');
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true
  });
  
  for (const record of records) {
    holders.push({
      address: record.address,
      token_id: record.token_id,
      lp: record.lp,
      contractAddress: record.contractAddress
    });
  }
  
  console.log(`Processing ${holders.length} LP positions...`);
  
  // For the comprehensive report, we'll store detailed position data
  const detailedPositions: DetailedPositionValue[] = [];
  
  for (let i = 0; i < holders.length; i++) {
    const holder = holders[i];
    
    try {
      console.log(`Processing position ${i+1}/${holders.length}: Address ${holder.address}, Token ID ${holder.token_id}`);
      
      // Calculate the position value
      const positionValue = await calculatePositionValue(
        holder.contractAddress,
        Number(holder.token_id)
      );
      
      // Determine contract name based on address
      let contractName = "Unknown";
      if (holder.contractAddress.toLowerCase() === "0x79cc7deA5eE05735a7503A32Dc4251C7f79F3Baf".toLowerCase()) {
        contractName = "Sailfish";
      } else if (holder.contractAddress.toLowerCase() === "0x9CC2B9F9a6194C5CC827C88571E42cEAA76FDF47".toLowerCase()) {
        contractName = "Camelot";
      }
      
      detailedPositions.push({
        address: holder.address,
        token_id: holder.token_id,
        contract_name: contractName,
        usd_value: positionValue
      });
      
      console.log(`Position value: $${positionValue}`);
    } catch (error) {
      console.error(`Error processing position for ${holder.address}, token ID ${holder.token_id}:`, error);
    }
  }
  
  // Write the comprehensive report
  const csvWriter = createObjectCsvWriter({
    path: outputPath,
    header: [
      { id: 'address', title: 'address' },
      { id: 'token_id', title: 'token_id' },
      { id: 'contract_name', title: 'contract_name' },
      { id: 'usd_value', title: 'usd_value' }
    ]
  });
  
  await csvWriter.writeRecords(detailedPositions);
  console.log(`Comprehensive report written to ${outputPath}`);
  
  // Log some statistics
  const totalValue = detailedPositions.reduce((sum, item) => sum + item.usd_value, 0);
  console.log(`Total LP value across all positions: $${totalValue.toFixed(2)}`);
  console.log(`Number of unique positions: ${detailedPositions.length}`);
}