import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import Filters from './index.vue';

vi.mock('~/composables', () => ({
  useApiGet: () => ({
    data: ref([
      { id: '1', name: 'Alimentação' },
      { id: '2', name: 'Transporte' },
    ]),
  }),
}));

const mountComponent = (props?: Partial<{
  search: string
  selectedCategory: string
  selectedSort: string
}>) =>
  mount(Filters, {
    props: {
      search: '',
      selectedCategory: '',
      selectedSort: 'Mais recente',
      ...props,
    },
    global: {
      stubs: {
        Input: {
          props: ['modelValue'],
          emits: ['update:modelValue'],
          template: `
            <input
              data-testid="input-search"
              :value="modelValue"
              @input="$emit('update:modelValue', $event.target.value)"
            />
          `,
        },
        Dropdown: {
          props: ['modelValue'],
          emits: ['update:modelValue'],
          template: `
          <div data-testid="dropdown-category">
            <span data-testid="dropdown-category-value">{{ modelValue }}</span>
            <button
              data-testid="dropdown-category-trigger"
              @click="$emit('update:modelValue', '1')"
            />
          </div>
        ` },
        SortByDropdown: {
          props: ['modelValue'],
          emits: ['update:modelValue'],
          template: `
            <div data-testid="dropdown-sort">
              <span data-testid="dropdown-sort-value">{{ modelValue }}</span>
              <button
                data-testid="dropdown-sort-trigger"
                @click="$emit('update:modelValue', 'A a Z')"
              />
            </div>
          ` },
      },
    },
  });

describe('Filters', () => {
  describe('Render', () => {
    it('Should render search input', () => {
      const wrapper = mountComponent();
      expect(wrapper.find('[data-testid="input-search"]').exists()).toBe(true);
    });

    it('Should render category dropdown', () => {
      const wrapper = mountComponent();
      expect(wrapper.find('[data-testid="dropdown-category"]').exists()).toBe(true);
    });

    it('Should render sort dropdown', () => {
      const wrapper = mountComponent();
      expect(wrapper.find('[data-testid="dropdown-sort"]').exists()).toBe(true);
    });
  });

  describe('Emits', () => {
    it('Should emit update:search when search value changes', async () => {
      const wrapper = mountComponent();
      const input = wrapper.get('[data-testid="input-search"]');

      await input.setValue('mercado');

      expect(wrapper.emitted('update:search')?.[0]).toEqual(['mercado']);
    });

    it('Should emit update:selectedCategory when category changes', async () => {
      const wrapper = mountComponent();

      await wrapper
        .get('[data-testid="dropdown-category-trigger"]')
        .trigger('click');

      expect(wrapper.emitted('update:selectedCategory')?.[0]).toEqual(['1']);
    });

    it('Should emit update:selectedSort when sort option changes', async () => {
      const wrapper = mountComponent();

      await wrapper
        .get('[data-testid="dropdown-sort-trigger"]')
        .trigger('click');

      expect(wrapper.emitted('update:selectedSort')?.[0]).toEqual(['A a Z']);
    });
  });

  describe('Props sync', () => {
    it('Should initialize local search with prop value', () => {
      const wrapper = mountComponent({ search: 'teste' });

      const input = wrapper.get('[data-testid="input-search"]');
      expect((input.element as HTMLInputElement).value).toBe('teste');
    });

    it('Should initialize selectedCategoryLocal with prop value', () => {
      const wrapper = mountComponent({ selectedCategory: 'cat-2' });

      expect(
        wrapper.get('[data-testid="dropdown-category-value"]').text(),
      ).toBe('cat-2');
    });

    it('Should initialize selectedSortLocal with prop value', () => {
      const wrapper = mountComponent({ selectedSort: 'Mais antigo' });

      expect(
        wrapper.get('[data-testid="dropdown-sort-value"]').text(),
      ).toBe('Mais antigo');
    });
  });
});
