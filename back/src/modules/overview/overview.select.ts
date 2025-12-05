export const getPotsSummarySelect = {
  id: true,
  name: true,
  totalAmount: true,
  theme: {
    select: {
      id: true,
      colorName: true,
      colorHex: true
    }
  },
};

export const getTransactionsSummarySelect = {
  id: true,
  name: true,
  date: true,
  amount: true,
};

export const getBudgetsSummarySelect = {
  id: true,
  maximumSpend: true,
  userId: true,
  category: {
    select: {
      id: true,
      name: true,
    }
  },
  theme: {
    select: {
      id: true,
      colorName: true,
      colorHex: true
    }
  },
  transactions: {
    select: {
      amount: true
    },
    orderBy: {
      date: "desc" as const,
    },
  },
};