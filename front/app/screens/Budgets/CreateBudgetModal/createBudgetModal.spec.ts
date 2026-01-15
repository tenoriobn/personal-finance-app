import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import CreateBudgetModal from './index.vue';

const handleSubmitMock = vi.fn();
const showCategories = ref(true);

vi.mock('./useCreateBudgetModal', () => ({
  useCreateBudgetModal: (onSuccess: () => void) => ({
    formState: {
      categoryId: '',
      themeId: '',
    },
    errors: {
      maximumSpend: '',
      categoryId: '',
      themeId: '',
    },
    isSubmitting: false,

    categories: showCategories.value
      ? [{ id: 'cat-1', name: 'Supermercado' }]
      : [],
    themes: [{ id: 'theme-1', colorName: 'Red', colorHex: '#ff0000' }],

    formattedAmount: 'R$ 100,00',
    onInput: vi.fn(),
    onKeyDown: vi.fn(),
    onPaste: vi.fn(),

    hasAvailableCategories: showCategories,
    modalIntro: showCategories.value
      ? 'Ao criar um orçamento e estabelecer um limite de gastos'
      : 'Você já criou orçamentos para todas as categorias disponíveis',

    handleSubmit: () => {
      handleSubmitMock();
      onSuccess();
    },
  }),
}));

vi.mock('#components', () => ({
  Modal: {
    template: `
      <div>
        <slot />
      </div>
    `,
    props: ['modelValue', 'title', 'intro', 'introHasSpacing'],
  },
  Input: {
    template: '<input />',
    props: ['modelValue', 'label', 'name', 'isSubmitting'],
  },
  Dropdown: {
    template: '<select />',
    props: ['modelValue', 'options', 'label'],
  },
  Button: {
    template: '<button type="submit">Criar</button>',
    props: ['isSubmitting', 'label'],
  },
  FormError: {
    template: '<span />',
    props: ['message'],
  },
}));

const mountComponent = (modelValue = true) =>
  mount(CreateBudgetModal, {
    props: { modelValue },
  });

describe('CreateBudgetModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    showCategories.value = true;
  });

  it('Should render modal title', () => {
    const wrapper = mountComponent();

    expect(wrapper.text()).toContain('Criar novo Orçamento');
  });

  it('Should render form when there are available categories', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('form').exists()).toBe(true);
  });

  it('Should render intro text when categories exist', () => {
    const wrapper = mountComponent();

    expect(wrapper.text()).toContain(
      'Ao criar um orçamento e estabelecer um limite de gastos',
    );
  });

  it('Should not render form when there are no available categories', () => {
    showCategories.value = false;

    const wrapper = mountComponent();

    expect(wrapper.find('form').exists()).toBe(false);
    expect(wrapper.text()).toContain(
      'Você já criou orçamentos para todas as categorias disponíveis',
    );
  });

  it('Should emit update:modelValue when modal is closed', async () => {
    const wrapper = mountComponent();

    wrapper.vm.$emit('update:modelValue', false);

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });
});
