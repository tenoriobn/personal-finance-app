export const transactionSelect = {
  id: true,
  name: true,
  date: true,
  amount: true,
  recurring: true,
  budget: {
    select: {
      category: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  }
};