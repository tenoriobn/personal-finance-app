import { useApiGet } from '~/composables/api/useApiMethods';

export function useBudgets() {
  const { data, pending } = useApiGet('budgets');
  const budgets = computed(() => data.value || []);

  return { budgets, pending };
}
