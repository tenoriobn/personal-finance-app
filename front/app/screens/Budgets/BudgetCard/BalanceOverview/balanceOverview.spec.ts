// front-end/Personal/9-personalFinanceApp/front/app/screens/Budgets/BudgetCard/BalanceOverview/balanceOverview.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import BalanceOverview from './index.vue';

vi.mock('~/utils', () => ({
  formatCurrency: vi.fn((value: number) => `formatted-${value}`),
}));

const mountComponent = (props?: { colorHex?: string, spent?: number, free?: number }) => {
  return mount(BalanceOverview, {
    props: {
      spent: props?.spent ?? 0,
      free: props?.free ?? 0,
      colorHex: props?.colorHex,
    },
  });
};

describe('BalanceOverview', () => {
  describe('Render', () => {
    it('Should render spent and free labels', () => {
      const wrapper = mountComponent();

      expect(wrapper.text()).toContain('Gasto');
      expect(wrapper.text()).toContain('Livre');
    });

    it('Should render formatted spent and free values', () => {
      const wrapper = mountComponent({ spent: 300, free: 200 });

      expect(wrapper.text()).toContain('formatted-300');
      expect(wrapper.text()).toContain('formatted-200');
    });
  });

  describe('Spent behavior', () => {
    it('Should apply custom color on spent indicator when colorHex is provided', () => {
      const wrapper = mountComponent({ colorHex: '#123456' });

      const indicator = wrapper.find('span[style]');
      expect(indicator.attributes('style')).toContain('background-color: #123456');
    });

    it('Should fallback to default color when colorHex is not provided', () => {
      const wrapper = mountComponent();

      const indicator = wrapper.find('span[style]');
      expect(indicator.attributes('style')).toContain('background-color: #ccc');
    });
  });

  describe('Free behavior', () => {
    it('Should render free value with default text color when value is positive', () => {
      const wrapper = mountComponent({ free: 150 });

      const freeValue = wrapper.findAll('p').find(p =>
        p.text().includes('formatted-150'),
      );

      expect(freeValue?.classes()).toContain('text-grey-900');
      expect(freeValue?.classes()).not.toContain('text-red');
    });

    it('Should render free value with red text color when value is negative', () => {
      const wrapper = mountComponent({ free: -50 });

      const freeValue = wrapper.findAll('p').find(p =>
        p.text().includes('formatted--50'),
      );

      expect(freeValue?.classes()).toContain('text-red');
    });
  });
});
