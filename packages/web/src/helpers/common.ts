export function isNumber(value: unknown): boolean {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function isNumberish(value: unknown): boolean {
  return isNumber(value) || !Number.isNaN(parseFloat(value as string));
}
