import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Navbar from './index.vue';
import { unref } from 'vue';

describe('Navbar', () => {
  it('alternar isCollapsed ao clicar no botão', async () => {
    const navbarComponent = mount(Navbar);

    const button = navbarComponent.find('[data-testid="colapse-navbar"]');
    expect(button.exists()).toBe(true);

    expect(unref(navbarComponent.vm.isCollapsed)).toBe(false);

    await button.trigger('click');
    expect(navbarComponent.vm.isCollapsed).toBe(true);

    await button.trigger('click');
    expect(navbarComponent.vm.isCollapsed).toBe(false);
  });
});
