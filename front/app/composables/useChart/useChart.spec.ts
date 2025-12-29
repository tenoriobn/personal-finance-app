import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, type Ref } from 'vue';
import type { Chart, TooltipItem, TooltipModel } from 'chart.js';
import { useChart } from './index';
import type { MinimalBudget } from './useChart.type';
import { formatCurrency } from '~/utils';
import { calculateSpent } from '~/utils/calculations';

vi.mock('~/utils', () => ({
  formatCurrency: vi.fn((value: number) => `R$ ${value}`),
}));

vi.mock('~/utils/calculations', () => ({
  calculateSpent: vi.fn(),
}));

const createBudgetsRef = (budgets: MinimalBudget[]): Ref<MinimalBudget[]> =>
  ref(budgets);

describe('useChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('chartData', () => {
    it('Should map budgets into chart labels, data and colors', () => {
      const budgets = createBudgetsRef([
        {
          maximumSpend: 500,
          category: { name: 'Compras' },
          theme: { colorHex: '#000000' },
          transactions: [],
        },
        {
          maximumSpend: 300,
          category: { name: 'Lazer' },
          theme: { colorHex: '#ffffff' },
          transactions: [],
        },
      ] as MinimalBudget[]);

      const { chartData } = useChart(budgets);

      expect(chartData.value.labels).toEqual(['Compras', 'Lazer']);
      expect(chartData.value.datasets[0]?.data).toEqual([500, 300]);
      expect(chartData.value.datasets[0]?.backgroundColor).toEqual([
        '#000000',
        '#ffffff',
      ]);
    });
  });

  describe('centerTextPlugin', () => {
    it('Should draw center text with formatted values', () => {
      vi.mocked(calculateSpent)
        .mockReturnValueOnce(200)
        .mockReturnValueOnce(100);

      const budgets = createBudgetsRef([
        {
          maximumSpend: 500,
          category: { name: 'Compras' },
          theme: { colorHex: '#000000' },
          transactions: [{}],
        },
        {
          maximumSpend: 300,
          category: { name: 'Lazer' },
          theme: { colorHex: '#ffffff' },
          transactions: [{}],
        },
      ] as MinimalBudget[]);

      const { centerTextPlugin } = useChart(budgets);

      const ctx = {
        save: vi.fn(),
        restore: vi.fn(),
        fillText: vi.fn(),
        textAlign: '',
        textBaseline: '',
        font: '',
        fillStyle: '',
      } as unknown as CanvasRenderingContext2D;

      const chart = {
        ctx,
        chartArea: { left: 0, right: 200, top: 0, bottom: 200 },
      } as unknown as Chart<'doughnut'>;

      centerTextPlugin.beforeDraw?.(
        chart,
        { cancelable: true },
        {} as Record<string, unknown>,
      );

      expect(formatCurrency).toHaveBeenCalledWith(300, false);
      expect(formatCurrency).toHaveBeenCalledWith(800, false);
      expect(ctx.fillText).toHaveBeenCalledTimes(2);
    });

    it('Should not draw center text when context is missing', () => {
      const budgets = createBudgetsRef([]);

      const { centerTextPlugin } = useChart(budgets);

      const chart = {} as Chart<'doughnut'>;

      const centerTextBeforeDraw = centerTextPlugin.beforeDraw?.(
        chart,
        { cancelable: true },
        {} as Record<string, unknown>,
      );

      expect(() => centerTextBeforeDraw).not.toThrow();
    });
  });

  describe('chartOptions', () => {
    it('Should format tooltip label using currency formatter', () => {
      const budgets = createBudgetsRef([]);

      const { chartOptions } = useChart(budgets);

      const labelCallback = chartOptions.plugins?.tooltip?.callbacks?.label;

      const label = labelCallback?.call(
        {} as unknown as TooltipModel<'doughnut'>,
        { raw: 150 } as TooltipItem<'doughnut'>,
      );

      expect(formatCurrency).toHaveBeenCalledWith(150, false);
      expect(label).toBe('R$ 150');
    });
  });
});
