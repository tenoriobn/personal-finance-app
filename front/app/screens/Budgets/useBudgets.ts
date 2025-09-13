export function useBudgets() {
  const { data, pending } = useFetch('/api/orcamentos');

  const budgets = computed(() => data.value?.budgets || []);
  return { budgets, pending };
}
