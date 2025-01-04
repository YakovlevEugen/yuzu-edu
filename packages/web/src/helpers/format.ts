import { Big } from 'big.js';
import { isNumberish } from './common';

export function formatNumberWithCommas(
  value?: string,
  options?: Intl.NumberFormatOptions
) {
  return isNumberish(value)
    ? Number(value).toLocaleString('en-US', options)
    : '';
}

export function formatBigNumber(value: string | number, dp = 2): string {
  return Big(value).div(1e18).toFixed(dp);
}

export function formatBigWithComas(value: string | number, dp = 2) {
  return formatNumberWithCommas(formatBigNumber(value, dp));
}
