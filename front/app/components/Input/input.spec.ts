import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Input from './index.vue';

const DummyIcon = {
  template: '<svg data-testid="icon" />',
};

const mountComponent = (props = {}) => {
  return mount(Input, {
    props: {
      label: 'Email',
      name: 'email',
      modelValue: '',
      icon: DummyIcon,
      ...props,
    },
  });
};

describe('Input', () => {
  it('Should render the input component', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('input').exists()).toBe(true);
  });

  it('Should display the label correctly', () => {
    const wrapper = mountComponent();

    expect(wrapper.text()).toContain('Email');
  });

  it('Should bind the input name and id correctly', () => {
    const wrapper = mountComponent({ name: 'password' });

    const input = wrapper.find('input');

    expect(input.attributes('name')).toBe('password');
    expect(input.attributes('id')).toBe('password');
  });

  it('Should use text type as default', () => {
    const wrapper = mountComponent();

    const input = wrapper.find('input');

    expect(input.attributes('type')).toBe('text');
  });

  it('Should accept a custom input type', () => {
    const wrapper = mountComponent({ type: 'email' });

    const input = wrapper.find('input');

    expect(input.attributes('type')).toBe('email');
  });

  it('Should emit update:modelValue when typing', async () => {
    const wrapper = mountComponent();

    const input = wrapper.find('input');

    await input.setValue('teste@email.com');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['teste@email.com']);
  });

  it('Should render the icon component when icon is provided', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true);
  });

  it('Should disable the input when isSubmitting is true', () => {
    const wrapper = mountComponent({ isSubmitting: true });

    const input = wrapper.find('input');

    expect(input.attributes('disabled')).toBeDefined();
  });

  it('Should not disable the input when isSubmitting is false', () => {
    const wrapper = mountComponent({ isSubmitting: false });

    const input = wrapper.find('input');

    expect(input.attributes('disabled')).toBeUndefined();
  });
});
