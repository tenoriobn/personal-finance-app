export const getSpent = (input: number | { amount: number }[] = []) => {
  if (typeof input === 'number') {
    return input;
  }

  return input.reduce((acc, t) => acc + (t.amount || 0), 0);
};

export const getFree = (
  input: number | { amount: number }[] = [],
  maximum: number,
) => {
  return maximum - getSpent(input);
};

export const getPercent = (
  input: number | { amount: number }[] = [],
  maximum: number,
) => {
  const spent = getSpent(input);

  if (!maximum || maximum <= 0) {
    return 0;
  }

  return Math.min((spent / maximum) * 100, 100);
};
