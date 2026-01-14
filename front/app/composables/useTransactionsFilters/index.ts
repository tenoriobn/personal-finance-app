export function useTransactionsFilters() {
  const search = useState<string>('transactionSearch', () => '');
  const selectedCategory = useState<string>('transactionCategory', () => '');
  const selectedSort = useState<string>('transactionSort', () => 'Mais recente');
  const currentPage = ref(1);
  const limit = ref(10);

  return {
    search,
    selectedCategory,
    selectedSort,
    currentPage,
    limit,
  };
}
