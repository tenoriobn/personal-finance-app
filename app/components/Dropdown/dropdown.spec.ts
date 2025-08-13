import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Dropdown from './index.vue';

describe('Dropdown', () => {
  it('should render and change dropdown menu value', async () => {
    const options = ['Oldest', 'Latest', 'A to Z', 'Z to A', 'Highest', 'Lowest'];

    const dropdownComponent = mount(Dropdown, {
      props: {
        'modelValue': 'Oldest',
        'label': 'Sort By',
        options,
        'data-testid': 'dropdown-sort-by',
      },
    });

    expect(dropdownComponent.text()).toContain('Oldest');

    await dropdownComponent.trigger('click');

    const option = dropdownComponent.findAll('li').find(li => li.text() === 'A to Z');
    expect(option).toBeTruthy();
    await option!.trigger('click');

    const emitted = dropdownComponent.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual(['A to Z']);
  });
});
