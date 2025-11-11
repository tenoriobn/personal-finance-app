export const getSpent = (transactions: { amount: number }[] = []) =>
  transactions.reduce((acc, t) => acc + (t.amount || 0), 0);

export const getFree = (transactions: { amount: number }[] = [], maximum: number) =>
  maximum - getSpent(transactions);

export const getPercent = (transactions: { amount: number }[] = [], maximum: number) => {
  const spent = getSpent(transactions);

  if (!maximum || maximum <= 0) {
    return 0;
  }

  return Math.min((spent / maximum) * 100, 100);
};
