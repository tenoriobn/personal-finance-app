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
  it('Should render correctly', () => {
    const wrapper = mountNavbar();
    expect(wrapper.exists()).toBe(true);
  });

  it('Should display the collapse menu button', () => {
    const wrapper = mountNavbar();
    wrapper.get('[data-testid="colapse-navbar"]');
  });

  it('Should toggle state when clicking the button', async () => {
    const wrapper = mountNavbar();
    const button = wrapper.get('[data-testid="colapse-navbar"]');

    await button.trigger('click');
    expect(button.attributes('aria-expanded')).toBe('false');

    await button.trigger('click');
    expect(button.attributes('aria-expanded')).toBe('true');
  });

  it('Should apply layout classes when collapsed', async () => {
    const wrapper = mountNavbar();
    const button = wrapper.get('[data-testid="colapse-navbar"]');

    await button.trigger('click');

    const nav = wrapper.get('#primary-navigation');
    expect(nav.classes()).toContain('lg:w-[100px]');
  });

  it('Should keep the collapsed state after remounting', async () => {
    const firstMount = mountNavbar();
    await firstMount
      .get('[data-testid="colapse-navbar"]')
      .trigger('click');

    const secondMount = mountNavbar();
    const button = secondMount.get('[data-testid="colapse-navbar"]');

    expect(button.attributes('aria-expanded')).toBe('false');
  });
});
