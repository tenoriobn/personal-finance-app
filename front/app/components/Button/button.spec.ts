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
  it('renderiza o botão', () => {
    const wrapper = mountButton();

    wrapper.get('button');
  });

  it('exibe o label corretamente', () => {
    const wrapper = mountButton({ label: 'Enviar' });

    expect(wrapper.text()).toContain('Enviar');
  });

  it('renderiza conteúdo do slot', () => {
    const wrapper = mountButton({}, { default: 'Conteúdo extra' });

    expect(wrapper.text()).toContain('Conteúdo extra');
  });

  it('fica desabilitado quando disabled é true', () => {
    const wrapper = mountButton({ disabled: true });

    expect(wrapper.get('button').attributes('disabled')).toBeDefined();
  });

  it('fica desabilitado e exibe loading quando isSubmitting é true', () => {
    const wrapper = mountButton({ isSubmitting: true });

    const button = wrapper.get('button');

    expect(button.attributes('disabled')).toBeDefined();
    expect(button.find('svg').exists()).toBe(true);
  });

  it('não exibe label nem slot quando está em loading', () => {
    const wrapper = mountButton(
      { isSubmitting: true },
      { default: 'Slot oculto' },
    );

    expect(wrapper.text()).not.toContain('Salvar');
    expect(wrapper.text()).not.toContain('Slot oculto');
  });

  it('define aria-busy quando está em loading', () => {
    const wrapper = mountButton({ isSubmitting: true });
    expect(wrapper.get('button').attributes('aria-busy')).toBe('true');
  });
});
