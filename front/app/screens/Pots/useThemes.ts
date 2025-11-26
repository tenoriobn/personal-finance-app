import { useApiGet } from '~/composables';
import type { ThemeData } from './pots.type';

export function useThemes() {
  const themes = useState<ThemeData[]>('pot-themes', () => []);

  const { data: themeData, refresh } = useApiGet<ThemeData[]>('themes/available/pot');

  if (themeData.value && themes.value.length === 0) {
    themes.value = themeData.value;
  }

  const refreshThemes = async () => {
    await refresh();

    if (themeData.value) {
      themes.value = themeData.value;
    }
  };

  return {
    themes,
    refreshThemes,
  };
}
