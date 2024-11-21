export function replaceCenterWithEllipsis(str?: string, numChars: number): string {
  if (!str) return ''

  const maxAllowed = Math.floor(str.length / 2)
  if (numChars >= maxAllowed) {
    numChars = maxAllowed
  }

  if (numChars * 2 >= str.length) {
    return str
  }

  const start = str.slice(0, numChars)
  const end = str.slice(str.length - numChars)

  return start + '...' + end
}
