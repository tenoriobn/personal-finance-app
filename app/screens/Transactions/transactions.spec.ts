import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Transactions from './index.vue';

describe('Transactions', () => {
  it('renderiza o texto "Transactions" no h2', () => {
    const wrapper = mount(Transactions);
    const h2 = wrapper.find('h2');
    expect(h2.exists()).toBe(true);
    expect(h2.text()).toBe('Transactions');
  });
});
