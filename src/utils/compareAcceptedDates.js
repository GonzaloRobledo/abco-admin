export const compareAcceptedDates = (a, b) =>
  new Date(b.accepted_date) - new Date(a.accepted_date)
