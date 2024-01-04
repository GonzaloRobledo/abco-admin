export const compareAcceptedDates = (a, b) =>
  new Date(b.createdAt) - new Date(a.accepted_date)
