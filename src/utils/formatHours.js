export const formatHours = hours => {
  const days = hours / 24

  if (days % 1 == 0) return `${days} days`

  return `${Math.floor(days)}d ${hours % 24}h`
}
