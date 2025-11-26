import { useApiGet } from '~/composables';
import type { CategoryData, ThemeData } from './budgets.type';

export function useCategoriesAndThemes() {
  const categories = useState<CategoryData[]>('budget-categories', () => []);
  const themes = useState<ThemeData[]>('budget-themes', () => []);

  const { data: catData, refresh: refreshCategories } = useApiGet<CategoryData[]>('categories/available');
  const { data: themeData, refresh: refreshThemes } = useApiGet<ThemeData[]>('themes/available/budget');

  if (catData.value && categories.value.length === 0) {
    categories.value = catData.value;
  }
  if (themeData.value && themes.value.length === 0) {
    themes.value = themeData.value;
  }

  const refreshCategoriesAndThemes = async () => {
    await refreshCategories();
    await refreshThemes();

    if (catData.value) {
      categories.value = catData.value;
    };
    if (themeData.value) {
      themes.value = themeData.value;
    }
  };

  return {
    categories,
    themes,
    refreshCategoriesAndThemes,
  };
}
