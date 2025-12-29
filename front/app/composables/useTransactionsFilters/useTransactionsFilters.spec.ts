import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useTransactionsFilters } from './index';

const useStateMock = vi.fn();

vi.stubGlobal('useState', useStateMock);

describe('useTransactionsFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useStateMock.mockImplementation((_key: string, init: () => string) => {
      return ref(init());
    });
  });

  describe('Default behavior', () => {
    it('Should initialize search as empty string', () => {
      const { search } = useTransactionsFilters();

      expect(search.value).toBe('');
    });

    it('Should initialize selectedCategory as empty string', () => {
      const { selectedCategory } = useTransactionsFilters();

      expect(selectedCategory.value).toBe('');
    });

    it('Should initialize selectedSort with default value', () => {
      const { selectedSort } = useTransactionsFilters();

      expect(selectedSort.value).toBe('Mais recente');
    });

    it('Should initialize currentPage as 1', () => {
      const { currentPage } = useTransactionsFilters();

      expect(currentPage.value).toBe(1);
    });

    it('Should initialize limit as 10', () => {
      const { limit } = useTransactionsFilters();

      expect(limit.value).toBe(10);
    });
  });

  describe('State behavior', () => {
    it('Should allow updating selectedCategory value', () => {
      const { selectedCategory } = useTransactionsFilters();

      selectedCategory.value = 'Compras';

      expect(selectedCategory.value).toBe('Compras');
    });
  });
});
