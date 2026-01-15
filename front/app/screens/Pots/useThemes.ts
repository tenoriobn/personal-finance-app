import type { ThemeData, ThemesCache } from './pots.type';
import { useApiGet } from '~/composables';

export function useThemes() {
  const cache = useState<ThemesCache | null>('pots-themes-cache', () => null);

  const { data, refresh } = useApiGet<ThemeData[]>('themes/available/pot', {
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

  const refreshThemes = async () => {
    cache.value = null;
    await refresh();
  };

  return {
    themes: computed(() => cache.value?.result ?? []),
    refreshThemes,
  };
}
