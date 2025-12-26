import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from './index.vue';

function mountButton(props = {}, slots = {}) {
  return mount(Button, {
    props: {
      label: 'Salvar',
      ...props,
    },
    slots,
  });
}

describe('Button', () => {
  it('Should render the button', () => {
    const wrapper = mountButton();

    wrapper.get('button');
  });

  it('Should display the label correctly', () => {
    const wrapper = mountButton({ label: 'Enviar' });

    expect(wrapper.text()).toContain('Enviar');
  });

  it('Should render slot content', () => {
    const wrapper = mountButton({}, { default: 'Conteúdo extra' });

    expect(wrapper.text()).toContain('Conteúdo extra');
  });

  it('Should be disabled when disabled is true', () => {
    const wrapper = mountButton({ disabled: true });

    expect(wrapper.get('button').attributes('disabled')).toBeDefined();
  });

  it('Should be disabled and display loading when isSubmitting is true', () => {
    const wrapper = mountButton({ isSubmitting: true });

    const button = wrapper.get('button');

    expect(button.attributes('disabled')).toBeDefined();
    expect(button.find('svg').exists()).toBe(true);
  });

  it('Should not display label or slot content when loading', () => {
    const wrapper = mountButton(
      { isSubmitting: true },
      { default: 'Slot oculto' },
    );

    expect(wrapper.text()).not.toContain('Salvar');
    expect(wrapper.text()).not.toContain('Slot oculto');
  });

  it('Should set aria-busy when loading', () => {
    const wrapper = mountButton({ isSubmitting: true });
    expect(wrapper.get('button').attributes('aria-busy')).toBe('true');
  });
});
