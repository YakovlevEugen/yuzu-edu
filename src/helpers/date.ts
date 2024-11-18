import { differenceInMilliseconds } from 'date-fns'

export function formatTimeDifference(date1: Date, date2: Date): string {
  let difference = Math.abs(differenceInMilliseconds(date1, date2))

  const days = Math.floor(difference / (24 * 60 * 60 * 1000))
  difference -= days * (24 * 60 * 60 * 1000)

  const hours = Math.floor(difference / (60 * 60 * 1000))
  difference -= hours * (60 * 60 * 1000)

  const minutes = Math.floor(difference / (60 * 1000))

  return `${days}D ${hours}H ${minutes}M`
}

export function formatTimeToDate(date: Date, dateAfter: Date) {
  if (date > dateAfter) return 'Expired Date'

  return formatTimeDifference(date, dateAfter)
}
