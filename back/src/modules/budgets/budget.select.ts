export const budgetSelect = {
  id: true,
  maximumSpend: true,
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
    orderBy: {
      date: "desc" as const,
    },
    take: 3,
  },
};