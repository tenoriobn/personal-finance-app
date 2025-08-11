import { describe, it, expect } from 'vitest';
import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import Filters from './index.vue';

describe('Filter', () => {
  let filtersComponent: VueWrapper;

  beforeEach(() => {
    filtersComponent = mount(Filters, {
      props: {
        search: '',
        selectedCategory: 'All Transactions',
        selectedSort: 'Oldest',
      },
    });
  });

  function findDropdown(wrapper: VueWrapper, testid: string) {
    return wrapper.find(`[data-testid="${testid}"]`);
  }

  async function selectDropdownOption(wrapper: VueWrapper, testid: string, optionText: string) {
    const dropdown = findDropdown(wrapper, testid);
    expect(dropdown.exists()).toBe(true);
    await dropdown.trigger('click');
    await wrapper.vm.$nextTick();

    const options = wrapper.findAll('li');
    const option = options.find(opt => opt.text() === optionText);
    expect(option).toBeTruthy();
    await option!.trigger('click');
  }

  it('Should issue "update:search" when adding text in search input', async () => {
    const input = filtersComponent.find('input[name="search"]');
    await input.setValue('Netflix');

    expect(filtersComponent.emitted('update:search')).toBeTruthy();
    expect(filtersComponent.emitted('update:search')![0]).toEqual(['Netflix']);
  });

  it('should emit "update:selectedSort" when selecting "Latest"', async () => {
    await selectDropdownOption(filtersComponent, 'dropdown-sort-by', 'Latest');
    expect(filtersComponent.emitted('update:selectedSort')).toBeTruthy();
    expect(filtersComponent.emitted('update:selectedSort')![0]).toEqual(['Latest']);
  });

  it('should emit "update:selectedCategory" when selecting "Bills" option in Category dropdown', async () => {
    await selectDropdownOption(filtersComponent, 'dropdown-category', 'Bills');
    expect(filtersComponent.emitted('update:selectedCategory')).toBeTruthy();
    expect(filtersComponent.emitted('update:selectedCategory')![0]).toEqual(['Bills']);
  });
});
