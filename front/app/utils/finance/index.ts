export const getSpent = (input: number | { amount: number }[] = []) => {
  return typeof input === 'number' ? input : input.reduce((acc, t) => acc + t.amount, 0);
};

export const getFree = (input: number | { amount: number }[] = [], maximum: number) => {
  return maximum - getSpent(input);
};

export const getPercent = (input: number | { amount: number }[] = [], maximum: number) => {
  if (!maximum || maximum <= 0) {
    return 0;
  }

  const spent = getSpent(input);

  return Math.min((spent / maximum) * 100, 100);
};
