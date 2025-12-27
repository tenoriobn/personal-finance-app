import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TitleSection from './index.vue';

const mountComponent = (props = {}) => {
  return mount(TitleSection, {
    props: {
      title: 'Página Inicial',
      ...props,
    },
  });
};

describe('TitleSection', () => {
  it('Should render the message when message is provided', () => {
    const wrapper = mountComponent();

    expect(wrapper.text()).toBe('Página Inicial');
  });

  it('Should render an h2 element', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('h2').exists()).toBe(true);
  });

  it('Should update the title when prop changes', async () => {
    const wrapper = mountComponent({ title: 'Dashboard' });

    expect(wrapper.text()).toBe('Dashboard');

    await wrapper.setProps({ title: 'Relatórios' });

    expect(wrapper.text()).toBe('Relatórios');
  });
});
