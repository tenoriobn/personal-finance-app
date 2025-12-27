import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Checkbox from './index.vue';

const mountComponent = (props = {}) => {
  return mount(Checkbox, {
    props: {
      modelValue: false,
      label: 'Aceito os termos',
      id: 'terms',
      ...props,
    },
  });
};

describe('Checkbox', () => {
  it('Should render the checkbox component', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true);
  });

  it('Should display the label correctly', () => {
    const wrapper = mountComponent();

    expect(wrapper.text()).toContain('Aceito os termos');
  });

  it('Should reflect the checked state from modelValue', async () => {
    const wrapper = mountComponent({ modelValue: true });

    const input = wrapper.find('input');

    expect((input.element as HTMLInputElement).checked).toBe(true);
  });

  it('Should emit update:modelValue when checkbox is checked', async () => {
    const wrapper = mountComponent({ modelValue: false });

    const input = wrapper.get('input');
    const el = input.element as HTMLInputElement;

    el.checked = true;
    await input.trigger('change');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);
  });

  it('Should emit update:modelValue when checkbox is unchecked', async () => {
    const wrapper = mountComponent({ modelValue: true });

    const input = wrapper.get('input');
    const el = input.element as HTMLInputElement;

    el.checked = false;
    await input.trigger('change');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false]);
  });

  it('Should disable the checkbox when isSubmitting is true', () => {
    const wrapper = mountComponent({ isSubmitting: true });

    const input = wrapper.find('input');

    expect(input.attributes('disabled')).toBeDefined();
  });

  it('Should not disable the checkbox when isSubmitting is false', () => {
    const wrapper = mountComponent({ isSubmitting: false });

    const input = wrapper.find('input');

    expect(input.attributes('disabled')).toBeUndefined();
  });
});
