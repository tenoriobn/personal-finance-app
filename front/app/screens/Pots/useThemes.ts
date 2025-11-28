import { useApiGet } from '~/composables';
import type { ThemeData } from './pots.type';

export function useThemes() {
  const { data: themes, refresh } = useApiGet<ThemeData[]>('themes/available/pot');

  return {
    themes,
    refreshThemes: refresh,
  };
}
