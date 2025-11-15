export function useTransactionState() {
  const search = ref('');
  const selectedCategory = useState<string>('transactionCategory', () => '');
  const selectedSort = ref('Mais recente');
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
