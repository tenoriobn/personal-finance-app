import type { PotData, PotsCache } from './pots.type';
import { useApiGet, useAuth } from '~/composables';
import { computed } from 'vue';

export function usePots() {
  const { token } = useAuth();
  const cache = useState<PotsCache | null>(`pots-cache-${token.value ?? 'guest'}`, () => null);

  const { data, pending, refresh } = useApiGet<PotData[]>('pots', {
    watch: false,
    immediate: false,
  });

  if (!cache.value) {
    refresh();
  }

  watch(
    () => data.value,
    (val) => {
      if (val) {
        cache.value = {
          result: val,
        };
      }
    },
  );

  const pots = computed(() => cache.value?.result ?? []);

  const refreshPots = async () => {
    cache.value = null;
    await refresh();
  };

  return {
    pots,
    pending,
    refreshPots,
  };
}
