import { Big } from 'big.js';

import { isNumber } from '@/helpers/common';

export function formatNumberWithCommas(value?: string): string {
  if (!value) return '';
  if (!isNumber(value) && !isNumber(Number(value))) return value;

  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatBigNumber(value: string | number, dp = 2): string {
  return Big(value).div(1e18).toFixed(dp);
}

export function formatBigWithComas(value: string | number, dp = 2) {
  return formatNumberWithCommas(formatBigNumber(value, dp));
}
