import fs from 'fs';
import path from 'path';
import { resolve } from 'path';
import { parse } from 'csv-parse/sync';

interface PostHogEntry {
  timestamp: string;
  'properties.address': string;
  'properties.referral': string;
}

/**
 * Processes PostHog data to extract the first referral connection for each user
 * @returns Array of [address, referral, timestamp] entries
 */
export const processReferralData = (): [string, string, string][] => {
  // Add logging to help debug the file path
  const dataFilePath = resolve(process.cwd(), 'data/posthog_jan17_march11.csv');
  console.log('Current working directory:', process.cwd());
  console.log('Attempting to access file at:', dataFilePath);
  console.log('File exists:', fs.existsSync(dataFilePath));

  // Read and parse the CSV file
  const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  }) as PostHogEntry[];

  // Group records by address
  const addressRecords = new Map<string, PostHogEntry[]>();

  // Process each record
  for (const record of records) {
    const address = record['properties.address']?.toLowerCase();
    let referral = record['properties.referral']?.toLowerCase();

    // Skip if missing required data
    if (!address || !referral) continue;

    if (address === 'undefined' || referral === 'undefined') {
      console.log('Undefined address || refferal:', record);
      continue;
    }

    // Extract Ethereum address from URL if present
    if (referral.includes('?ref=')) {
      const match = referral.match(/0x[a-f0-9]{40}/i);
      referral = match ? match[0].toLowerCase() : referral;
    }

    if (referral.includes('https://id.opencampus.xyz/')) {
      continue;
    }

    // Skip self-referrals (where address equals referral)
    if (address === referral) continue;

    // Add validation for Ethereum address format

    //TALK WITH VLAD ABOUT THIS
    const isValidEthAddress = /^0x[a-f0-9]{40}$/i.test(referral);
    if (!isValidEthAddress) {
      console.log('Invalid referral address format:', {
        address,
        referral,
        originalReferral: record['properties.referral'],
        timestamp: record.timestamp
      });

      continue;
    }

    // Add record to the address group
    if (!addressRecords.has(address)) {
      addressRecords.set(address, []);
    }
    (addressRecords.get(address) as PostHogEntry[]).push({
      ...record,
      'properties.referral': referral
    });
  }

  // Debug: Log a sample of addresses and their records
  // DEV TEMPORARY
  // console.log('\n===== SAMPLE OF ADDRESS RECORDS =====');
  // let count = 0;
  // for (const [address, entries] of addressRecords.entries()) {
  //   if (count >= 5) break; // Only show 5 addresses

  //   console.log(`\nAddress: ${address}`);
  //   console.log(`Number of referral events: ${entries.length}`);
  //   console.log('Referral events:');

  //   // Sort entries by timestamp for this display
  //   const sortedEntries = [...entries].sort(
  //     (a, b) =>
  //       new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  //   );

  //   sortedEntries.forEach((entry, i) => {
  //     console.log(`  ${i + 1}. Timestamp: ${entry.timestamp}`);
  //     console.log(`     Referrer: ${entry['properties.referral']}`);
  //   });

  //   // Show which one will be selected as the earliest
  //   console.log(
  //     `\n→ First referrer: ${sortedEntries[0]['properties.referral']}`
  //   );
  //   console.log(`→ First timestamp: ${sortedEntries[0].timestamp}`);

  //   count++;
  // }
  // console.log('\n======================================\n');

  // Find the earliest record for each address
  const addressMap = new Map<string, { referral: string; timestamp: string }>();

  for (const [address, addressEntries] of addressRecords.entries()) {
    // Skip if no valid entries after filtering
    if (addressEntries.length === 0) continue;

    // Sort entries by timestamp (ascending)
    addressEntries.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Get the earliest entry
    const earliestEntry = addressEntries[0];
    addressMap.set(address, {
      referral: earliestEntry['properties.referral'].toLowerCase(),
      timestamp: earliestEntry.timestamp
    });
  }

  // Convert map to array of [address, referral, timestamp]
  return Array.from(addressMap.entries()).map(([address, data]) => [
    address,
    data.referral,
    data.timestamp
  ]);
};

/**
 * Saves referral data to a CSV file
 * @param data Array of [address, referral, timestamp] entries
 * @returns Path to the created file
 */
export const saveReferralData = (data: [string, string, string][]): string => {
  const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const filename = `ref_data_${now}.csv`;
  const outputPath = path.join(process.cwd(), 'data', filename);

  // Sort data by timestamp in descending order (newest first)
  const sortedData = [...data].sort((a, b) => {
    const timestampA = new Date(a[2]).getTime();
    const timestampB = new Date(b[2]).getTime();
    return timestampB - timestampA; // Descending order
  });

  // Create CSV content with header
  const csvContent = [
    'address,referral,timestamp',
    ...sortedData.map((row) => row.join(','))
  ].join('\n');

  // Write to file
  fs.writeFileSync(outputPath, csvContent);

  return outputPath;
};

/**
 * Main function to process PostHog data and extract referral information
 * @returns Path to the created file
 */
export const formatPostHogReferrals = (): string => {
  const data = processReferralData();
  return saveReferralData(data);
};
