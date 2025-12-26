import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Dropdown from './index.vue';
import type { DropdownOption } from './dropdown.type';

const OPTIONS: DropdownOption[] = [
  { id: '1', name: 'Option 1' },
  { id: '2', name: 'Option 2' },
];

const mountComponent = (props = {}) => {
  return mount(Dropdown, {
    props: {
      label: 'Test Dropdown',
      options: OPTIONS,
      modelValue: undefined,
      ...props,
    },
    attachTo: document.body,
  });
};

describe('Dropdown', () => {
  it('Should render the dropdown wrapper and label', () => {
    const wrapper = mountComponent();

    expect(wrapper.text()).toContain('Test Dropdown');
  });

  it('Should not render the options list when closed', () => {
    const wrapper = mountComponent();

    const list = wrapper.find('ul');
    expect(list.exists()).toBe(false);
  });

  it('Should open the dropdown when clicking the wrapper', async () => {
    const wrapper = mountComponent();

    await wrapper.trigger('click');

    const list = wrapper.find('ul');
    expect(list.exists()).toBe(true);
  });

  it('Should render all options when open', async () => {
    const wrapper = mountComponent();

    await wrapper.trigger('click');

    const items = wrapper.findAll('li');
    expect(items.length).toBe(OPTIONS.length);
  });

  it('Should emit update:modelValue when selecting an option', async () => {
    const wrapper = mountComponent();

    await wrapper.trigger('click');

    const firstOption = wrapper.findAll('li').at(0);
    expect(firstOption).toBeDefined();
    await firstOption!.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['1']);
  });

  it('Should close the dropdown after selecting an option', async () => {
    const wrapper = mountComponent();

    await wrapper.trigger('click');
    expect(wrapper.find('ul').exists()).toBe(true);

    const firstOption = wrapper.findAll('li').at(0);

    expect(firstOption).toBeDefined();
    await firstOption!.trigger('click');

    expect(wrapper.find('ul').exists()).toBe(false);
  });

  it('Should display the selected option label', async () => {
    const wrapper = mountComponent({
      modelValue: '2',
    });

    expect(wrapper.text()).toContain('Option 2');
  });

  it('Should close the dropdown when clicking the trigger again', async () => {
    const wrapper = mountComponent();

    await wrapper.trigger('click');
    expect(wrapper.find('ul').exists()).toBe(true);

    await wrapper.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('ul').exists()).toBe(false);
  });
});
