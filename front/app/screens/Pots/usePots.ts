import { useApiGet } from '~/composables';
import { computed } from 'vue';
import type { PotData } from './pots.type';

export function usePots() {
  const { data, pending, error, refresh } = useApiGet<PotData[]>('pots');

  const pots = computed(() => data.value || []);

  return {
    pots,
    pending,
    error,
    refreshPots: refresh,
  };
}
