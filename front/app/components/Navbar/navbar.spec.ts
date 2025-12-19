import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Navbar from './index.vue';

vi.mock('vue-router', () => ({
  useRoute: () => ({
    path: '/overview',
  }),
}));

const mountNavbar = () =>
  mount(Navbar, {
    global: {
      stubs: {
        NuxtLink: {
          template: '<a><slot /></a>',
        },
        Logo: true,
      },
    },
  });

beforeEach(() => {
  document.cookie
    = 'navbar-collapsed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
});

describe('Navbar', () => {
  it('renderiza corretamente', () => {
    const wrapper = mountNavbar();
    expect(wrapper.exists()).toBe(true);
  });

  it('exibe o botão de colapsar menu', () => {
    const wrapper = mountNavbar();
    wrapper.get('[data-testid="colapse-navbar"]');
  });

  it('alterna o estado ao clicar no botão', async () => {
    const wrapper = mountNavbar();
    const button = wrapper.get('[data-testid="colapse-navbar"]');

    await button.trigger('click');
    expect(button.attributes('aria-expanded')).toBe('false');

    await button.trigger('click');
    expect(button.attributes('aria-expanded')).toBe('true');
  });

  it('aplica classes de layout quando colapsado', async () => {
    const wrapper = mountNavbar();
    const button = wrapper.get('[data-testid="colapse-navbar"]');

    await button.trigger('click');

    const nav = wrapper.get('#primary-navigation');
    expect(nav.classes()).toContain('lg:w-[100px]');
  });

  it('mantém o estado colapsado após nova renderização', async () => {
    const firstMount = mountNavbar();
    await firstMount
      .get('[data-testid="colapse-navbar"]')
      .trigger('click');

    const secondMount = mountNavbar();
    const button = secondMount.get('[data-testid="colapse-navbar"]');

    expect(button.attributes('aria-expanded')).toBe('false');
  });
});
