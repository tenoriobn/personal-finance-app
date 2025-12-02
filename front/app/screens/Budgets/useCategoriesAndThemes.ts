import { useApiGet } from '~/composables';
import type { CategoryData, ThemeData } from './budgets.type';

export function useCategoriesAndThemes() {
  const { data: categories, refresh: refreshCategories } = useApiGet<CategoryData[]>('categories/available');
  const { data: themes, refresh: refreshThemes } = useApiGet<ThemeData[]>('themes/available/budget');

  const refreshCategoriesAndThemes = async () => {
    await refreshCategories();
    await refreshThemes();
  };

  return {
    categories,
    themes,
    refreshCategoriesAndThemes,
  };
}
