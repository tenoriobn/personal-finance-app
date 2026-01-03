import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import FinancialPots from './index.vue';
import type { OverviewPot } from '../overview.type';

const summaryPotsMock = ref<OverviewPot | null>(null);
const pendingMock = ref(false);

vi.mock('../useOverview', () => ({
  useOverview: () => ({
    summaryPots: summaryPotsMock,
    pending: pendingMock,
  }),
}));

const formatCurrencyMock = vi.fn();
vi.mock('~/utils', () => ({
  formatCurrency: (...args: Parameters<typeof formatCurrencyMock>) =>
    formatCurrencyMock(...args),
}));

const globalMountOptions = {
  global: {
    stubs: {
      NuxtLink: {
        template: '<a :href="to"><slot /></a>',
        props: ['to'],
      },
    },
  },
};

function makePot(
  overrides?: Partial<OverviewPot['pots'][number]>,
): OverviewPot['pots'][number] {
  return {
    id: 'pot-1',
    name: 'Reserva',
    totalAmount: 100,
    theme: {
      colorHex: '#00FF00',
      colorName: 'Green',
    },
    ...overrides,
  };
}

describe('Overview > FinancialPots', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pendingMock.value = false;
    summaryPotsMock.value = null;
  });

  it('Should render section title', () => {
    const wrapper = mount(FinancialPots, globalMountOptions);

    expect(wrapper.text()).toContain('Poupanças');
  });

  it('Should render link to pots page', () => {
    const wrapper = mount(FinancialPots, globalMountOptions);

    const link = wrapper.find('a[href="/poupancas"]');

    expect(link.exists()).toBe(true);
    expect(link.text()).toContain('Ver todos');
  });

  it('Should render skeleton when pending', () => {
    pendingMock.value = true;

    const wrapper = mount(FinancialPots);

    expect(wrapper.find('.animate-pulse').exists()).toBe(true);
  });

  it('Should render total saved amount when not pending', () => {
    summaryPotsMock.value = {
      totalPotsAmount: 500,
      pots: [],
    };

    formatCurrencyMock.mockReturnValue('R$ 500,00');

    const wrapper = mount(FinancialPots);

    expect(formatCurrencyMock).toHaveBeenCalledWith(500, false);
    expect(wrapper.text()).toContain('R$ 500,00');
  });

  it('Should render list of pots', () => {
    summaryPotsMock.value = {
      totalPotsAmount: 300,
      pots: [
        makePot({ id: '1', name: 'Viagem' }),
        makePot({ id: '2', name: 'Emergência' }),
      ],
    };

    formatCurrencyMock.mockReturnValue('R$ 100,00');

    const wrapper = mount(FinancialPots);

    expect(wrapper.text()).toContain('Viagem');
    expect(wrapper.text()).toContain('Emergência');
  });

  it('Should apply theme color to pot indicator bar', () => {
    summaryPotsMock.value = {
      totalPotsAmount: 100,
      pots: [
        makePot({
          theme: {
            colorHex: '#FF0000',
            colorName: 'Red',
          },
        }),
      ],
    };

    formatCurrencyMock.mockReturnValue('R$ 100,00');

    const wrapper = mount(FinancialPots);
    const indicator = wrapper.find('span');

    expect(indicator.attributes('style')).toContain(
      'background-color: #FF0000',
    );
  });

  it('Should format pot value without signal', () => {
    summaryPotsMock.value = {
      totalPotsAmount: 0,
      pots: [
        makePot({ totalAmount: 250 }),
      ],
    };

    formatCurrencyMock.mockReturnValue('R$ 250,00');

    mount(FinancialPots);

    expect(formatCurrencyMock).toHaveBeenCalledWith(250, false);
  });
});
