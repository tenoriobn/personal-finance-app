import { useApiGet } from '~/composables';
import type { CategoryData, ThemeData } from './budgets.type';

export function useCategoriesAndThemes() {
  const cachedCategories = useState<CategoryData[] | null>('budgets-categories-cache', () => null);
  const cachedThemes = useState<ThemeData[] | null>('budgets-themes-cache', () => null);

  const { data: categories, refresh: refreshCategories } = useApiGet<CategoryData[]>('categories/available', {
    watch: false,
    immediate: false,
  });

  const { data: themes, refresh: refreshThemes } = useApiGet<ThemeData[]>('themes/available/budget', {
    watch: false,
    immediate: false,
  });

  if (!cachedCategories.value) {
    refreshCategories();
  }

  if (!cachedThemes.value) {
    refreshThemes();
  }

  watch(() => categories.value, (val) => {
    if (val) {
      cachedCategories.value = val;
    }
  });

  watch(() => themes.value, (val) => {
    if (val) {
      cachedThemes.value = val;
    }
  });

  const refreshCategoriesAndThemes = async () => {
    cachedCategories.value = null;
    cachedThemes.value = null;

    await refreshCategories();
    await refreshThemes();
  };

  return {
    categories: computed(() => cachedCategories.value ?? []),
    themes: computed(() => cachedThemes.value ?? []),
    refreshCategoriesAndThemes,
  };
}
