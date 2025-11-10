import { useApiGet } from '~/composables/api/useApiMethods';

export function useBudgets() {
  const { data, pending } = useFetch('/api/orcamentos');

  const budgets = computed(() => data.value?.budgets || []);
  return { budgets, pending };
}

export function useBudgetsTest() {
  const { data, pending } = useApiGet('budgets');
}
