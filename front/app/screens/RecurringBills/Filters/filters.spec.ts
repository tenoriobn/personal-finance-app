import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Filters from './index.vue';

const globalMountOptions = {
  global: {
    stubs: {
      Input: {
        template: `
          <input
            data-test="search-input"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
          />
        `,
        props: ['modelValue'],
      },

      SortByDropdown: {
        template: `
          <select
            data-test="sort-dropdown"
            :value="modelValue"
            @change="$emit('update:modelValue', $event.target.value)"
          >
            <option value="Mais recente">Mais recente</option>
            <option value="Mais antigo">Mais antigo</option>
          </select>
        `,
        props: ['modelValue'],
      },
    },
  },
};

describe('RecurringBills > Filters', () => {
  const mountComponent = (props = {}) => {
    return mount(Filters, {
      props: {
        search: '',
        selectedSort: 'Mais recente',
        ...props,
      },
      ...globalMountOptions,
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should render search input and sort dropdown', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('[data-test="search-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="sort-dropdown"]').exists()).toBe(true);
  });

  it('Should initialize search input with prop value', () => {
    const wrapper = mountComponent({ search: 'Netflix' });

    const input = wrapper.find('[data-test="search-input"]');

    expect((input.element as HTMLInputElement).value).toBe('Netflix');
  });

  it('Should initialize sort dropdown with prop value', () => {
    const wrapper = mountComponent({ selectedSort: 'Mais antigo' });

    const select = wrapper.find('[data-test="sort-dropdown"]');

    expect((select.element as HTMLSelectElement).value).toBe('Mais antigo');
  });

  it('Should emit update:search when typing in input', async () => {
    const wrapper = mountComponent();

    const input = wrapper.find('[data-test="search-input"]');

    await input.setValue('Aluguel');

    expect(wrapper.emitted('update:search')).toBeTruthy();
    expect(wrapper.emitted('update:search')![0]).toEqual(['Aluguel']);
  });

  it('Should emit update:selectedSort when changing dropdown', async () => {
    const wrapper = mountComponent();

    const select = wrapper.find('[data-test="sort-dropdown"]');

    await select.setValue('Mais antigo');

    expect(wrapper.emitted('update:selectedSort')).toBeTruthy();
    expect(wrapper.emitted('update:selectedSort')![0]).toEqual(['Mais antigo']);
  });
});
