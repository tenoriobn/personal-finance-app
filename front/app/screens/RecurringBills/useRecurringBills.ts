import type { RecurringBillsCache, RecurringBillsResponse } from './recurringBills.type';
import { useApiGet, useAuth } from '~/composables';

export function useRecurringBills() {
  const { token } = useAuth();
  const cache = useState<RecurringBillsCache | null>(`recurring-bills-cache-${token.value ?? 'guest'}`, () => null);

  const search = useState<string>(`recurringBillSearch-${token.value ?? 'guest'}`, () => '');
  const selectedSort = useState<string>(`recurringBillSort-${token.value ?? 'guest'}`, () => 'Mais recente');
  const currentPage = ref(1);
  const limit = ref(10);

  const filters = computed(() => ({
    search: search.value || null,
    sort: selectedSort.value || null,
    page: currentPage.value,
  }));

  const filtersAreDifferent = () => {
    if (!cache.value) {
      return true;
    }

    return (
      cache.value.filters.search !== filters.value.search
      || cache.value.filters.sort !== filters.value.sort
      || cache.value.filters.page !== filters.value.page
    );
  };

  const { data, pending, refresh } = useApiGet<RecurringBillsResponse>('recurring-bills', {
    query: {
      search,
      sort: selectedSort,
      page: currentPage,
      limit,
    },
    watch: false,
    immediate: false,
  });

  const summaryCache = useState<RecurringBillsResponse['summary'] | null>(
    'recurring-bills-summary-cache',
    () => null,
  );

  const { data: summaryData, pending: summaryPending, refresh: refreshSummary }
    = useApiGet<RecurringBillsResponse>('recurring-bills', {
      query: { page: 1, limit: 1 },
      watch: false,
      immediate: false,
    });

  if (filtersAreDifferent()) {
    refresh();
  }

  if (!summaryCache.value) {
    refreshSummary();
  }

  watch(
    () => data.value,
    (val) => {
      if (val) {
        cache.value = {
          filters: { ...filters.value },
          result: val,
        };
      }
    },
  );

  watch(
    () => summaryData.value,
    (val) => {
      if (val?.summary) {
        summaryCache.value = val.summary;
      }
    },
  );

  watch([search, selectedSort], () => {
    currentPage.value = 1;
    cache.value = null;
    refresh();
  });

  watch(currentPage, () => {
    cache.value = null;
    refresh();
  });

  const bills = computed(() => cache.value?.result?.data ?? []);
  const summary = computed(() => summaryCache.value ?? null);
  const totalPages = computed(() => cache.value?.result?.totalPages ?? 1);

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  const refreshBills = async () => {
    cache.value = null;
    await refresh();
    summaryCache.value = null;
    await refreshSummary();
  };

  return {
    search,
    selectedSort,
    currentPage,
    totalPages,
    bills,
    summary,
    pending,
    summaryPending,
    goToPage,
    refreshBills,
  };
}
