import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import FormError from './index.vue';

const mountComponent = (props = {}) => {
  return mount(FormError, {
    props: {
      message: 'Não foi possível carregar os dados.',
      ...props,
    },
  });
};

describe('FormError', () => {
  it('Should render the message when message is provided', () => {
    const wrapper = mountComponent();

    expect(wrapper.text()).toBe('Não foi possível carregar os dados.');
  });

  it('Should not render when message is undefined', () => {
    const wrapper = mount(FormError);

    expect(wrapper.find('p').exists()).toBe(false);
  });

  it('Should apply error styles correctly', () => {
    const wrapper = mountComponent();

    const p = wrapper.find('p');

    expect(p.classes()).toContain('text-red');
    expect(p.classes()).toContain('text-sm');
  });
});
