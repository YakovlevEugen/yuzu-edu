export interface ITVLData {
  timestamp: number;
  value: bigint;
}

export interface ITVLHistoricalData {
  data: ITVLData[];
  totalValue: bigint;
}
