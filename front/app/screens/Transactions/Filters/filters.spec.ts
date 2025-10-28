import { describe, it, expect } from 'vitest';
import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import Filters from './index.vue';

describe.skip('Filter', () => {
  let filtersComponent: VueWrapper;

  beforeEach(() => {
    filtersComponent = mount(Filters, {
      props: {
        search: '',
        selectedCategory: 'Todas',
        selectedSort: 'Mais antigo',
      },
    });
  });

  function findDropdown(component: VueWrapper, testid: string) {
    return component.find(`[data-testid="${testid}"]`);
  }

  async function selectDropdownOption(component: VueWrapper, testid: string, optionText: string) {
    const dropdown = findDropdown(component, testid);
    expect(dropdown.exists()).toBe(true);
    await dropdown.trigger('click');
    await component.vm.$nextTick();

    const options = component.findAll('li');
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

  it('should emit "update:selectedSort" when selecting "Mais recente"', async () => {
    await selectDropdownOption(filtersComponent, 'dropdown-sort-by', 'Mais recente');
    expect(filtersComponent.emitted('update:selectedSort')).toBeTruthy();
    expect(filtersComponent.emitted('update:selectedSort')![0]).toEqual(['Mais recente']);
  });

  it('should emit "update:selectedCategory" when selecting "Fundos" option in Category dropdown', async () => {
    await selectDropdownOption(filtersComponent, 'dropdown-category', 'Fundos');
    expect(filtersComponent.emitted('update:selectedCategory')).toBeTruthy();
    expect(filtersComponent.emitted('update:selectedCategory')![0]).toEqual(['Fundos']);
  });
});
