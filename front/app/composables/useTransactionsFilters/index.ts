import { useAuth } from '~/composables';

export function useTransactionsFilters() {
  const { token } = useAuth();
  const search = useState<string>(`transactionSearch-${token.value ?? 'guest'}`, () => '');
  const selectedCategory = useState<string>(`transactionCategory-${token.value ?? 'guest'}`, () => '');
  const selectedSort = useState<string>(`transactionSort-${token.value ?? 'guest'}`, () => 'Mais recente');
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
