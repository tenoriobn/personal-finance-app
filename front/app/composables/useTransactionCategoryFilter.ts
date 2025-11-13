export const useTransactionCategoryFilter = () => {
  const category = useState<string>('transactionCategory', () => '');
  return { category };
};
