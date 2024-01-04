export const calculateFees = (expired, acc_fee) => {
  return expired < 0
    ? parseFloat(Math.abs((expired * acc_fee) / 720).toFixed(2))
    : 0
}
