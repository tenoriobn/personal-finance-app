import { useApiGet } from '~/composables';
import type { PotData } from './pots.type';
import type { FetchError } from 'ofetch';

export function usePots() {
  const pots = useState<PotData[]>('pots', () => []);
  const pending = ref(false);

  let data: Ref<PotData[] | null>;
  let error: Ref<FetchError<PotData[]> | undefined>;
  let refresh: () => Promise<void>;

  async function getPots() {
    pending.value = true;

    ({ data, error, refresh } = await useApiGet<PotData[]>('pots'));

    if (!refresh) {
      return;
    }

    if (!error.value && data.value) {
      pots.value = data.value;
    }

    pending.value = false;
  }

  async function refreshPots() {
    if (!refresh) {
      return;
    }

    await refresh();

    if (!error.value && data.value) {
      pots.value = data.value;
    }
  }

  return {
    pots,
    getPots,
    refreshPots,
    pending,
  };
}
