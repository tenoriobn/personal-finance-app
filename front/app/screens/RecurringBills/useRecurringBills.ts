import { useApiGet } from '~/composables';
import type { RecurringBillsResponse } from './recurringBills.type';

export function useRecurringBills() {
  const search = ref('');
  const selectedSort = ref('Mais recente');
  const currentPage = ref(1);
  const limit = ref(10);

  const { data, pending, refresh } = useApiGet<RecurringBillsResponse>('recurring-bills',
    {
      query: {
        search,
        sort: selectedSort,
        page: currentPage,
        limit,
      },
      watch: [search, selectedSort, currentPage],
    },
  );

  const bills = computed(() => {
    return data.value?.data ?? [];
  });

  const summary = computed(() => {
    return data.value?.summary;
  });

  const totalPages = computed(() => data.value?.totalPages ?? 1);

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  watch([search, selectedSort], () => {
    currentPage.value = 1;
  });

  return {
    search,
    selectedSort,
    currentPage,
    totalPages,
    bills,
    summary,
    pending,
    goToPage,
    refresh,
    data,
  };
}
