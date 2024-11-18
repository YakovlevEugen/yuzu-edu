export function isNumber(value): boolean {
  return typeof value === 'number' && !isNaN(value)
}
