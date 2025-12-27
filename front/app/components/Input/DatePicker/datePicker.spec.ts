import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import DatePicker from './index.vue';

type DatePickerExposed = {
  internalDate: Date | null
};

vi.mock('~/composables', () => ({
  useClickOutside: vi.fn(),
}));

const VDatePickerStub = {
  template: '<div data-testid="v-date-picker" />',
  props: ['modelValue'],
};

const mountComponent = (props = {}) => {
  return mount(DatePicker, {
    props: {
      modelValue: '',
      label: 'Data',
      name: 'date',
      ...props,
    },
    global: {
      stubs: {
        VDatePicker: VDatePickerStub,
      },
    },
  });
};

describe('DatePicker', () => {
  it('Should render the input component', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('input').exists()).toBe(true);
  });

  it('Should open the calendar when input is focused', async () => {
    const wrapper = mountComponent();

    const input = wrapper.find('input');
    await input.trigger('focusin');

    expect(wrapper.find('[data-testid="v-date-picker"]').exists()).toBe(true);
  });

  it('Should disable the input when isSubmitting is true', () => {
    const wrapper = mountComponent({ isSubmitting: true });

    const input = wrapper.find('input');

    expect((input.element as HTMLInputElement).disabled).toBe(true);
  });

  it('Should display formatted date when modelValue is provided', () => {
    const wrapper = mountComponent({
      modelValue: '2024-01-10T12:00:00.000Z',
    });

    const input = wrapper.find('input');

    expect((input.element as HTMLInputElement).value).toBe('10/01/2024');
  });

  it('Should emit update:modelValue when internal date changes', async () => {
    const wrapper = mountComponent();

    const vm = wrapper.vm as unknown as DatePickerExposed;
    vm.internalDate = new Date('2024-02-15T12:00:00.000Z');
    await wrapper.vm.$nextTick();

    const emitted = wrapper.emitted('update:modelValue');

    expect(emitted).toBeTruthy();

    if (!emitted) {
      throw new Error('update:modelValue was not emitted');
    }

    expect(emitted?.[0]?.[0]).toContain('2024-02-15');
  });
});
