import { isNumber } from '@/helpers/common'

export function formatNumberWithCommas(value): string {
  if (!isNumber(value) && !isNumber(Number(value))) return value

  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
