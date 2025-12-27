import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import SortByDropdown from './index.vue';
import { sortOptions } from './sortOptions';

const DropdownStub = {
  template: `
    <div data-testid="dropdown-sort-by">
      <button @click="$emit('update:modelValue', 'Mais antigo')">
        Change value
      </button>
    </div>
  `,
  props: ['modelValue', 'label', 'options'],
};

const mountComponent = (props = {}) => {
  return mount(SortByDropdown, {
    props: {
      modelValue: 'Mais recente',
      ...props,
    },
    global: {
      stubs: {
        Dropdown: DropdownStub,
      },
    },
  });
};

describe('SortByDropdown', () => {
  it('Should render the Dropdown component', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('[data-testid="dropdown-sort-by"]').exists()).toBe(true);
  });

  it('Should pass correct options to Dropdown', () => {
    const wrapper = mountComponent();

    const dropdown = wrapper.findComponent(DropdownStub);

    expect(dropdown.props('options')).toEqual(sortOptions);
    expect(dropdown.props('label')).toBe('Ordenar por');
  });

  it('Should initialize with modelValue', () => {
    const wrapper = mountComponent({ modelValue: 'A a Z' });

    const dropdown = wrapper.findComponent(DropdownStub);

    expect(dropdown.props('modelValue')).toBe('A a Z');
  });

  it('Should emit update:modelValue when internal value changes', async () => {
    const wrapper = mountComponent();

    await wrapper.find('button').trigger('click');

    const emitted = wrapper.emitted('update:modelValue');

    expect(emitted).toBeTruthy();
    expect(emitted?.[0]).toEqual(['Mais antigo']);
  });
});
