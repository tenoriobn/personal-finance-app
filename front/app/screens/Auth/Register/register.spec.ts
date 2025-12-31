import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VueWrapper } from '@vue/test-utils';
import { mount, flushPromises } from '@vue/test-utils';
import Register from './index.vue';

const navigateToMock = vi.fn();
const notifyMock = vi.fn();
const setTokenMock = vi.fn();
const apiPostMock = vi.hoisted(() => vi.fn());

vi.mock('~/composables', () => ({
  useToast: () => ({
    notify: notifyMock,
  }),
  useAuth: () => ({
    setToken: setTokenMock,
  }),
  useApiPost: apiPostMock,
}));

vi.mock('~/utils', () => ({
  handleApiErrors: vi.fn(),
}));

const mountComponent = (): VueWrapper => {
  return mount(Register, {
    global: {
      stubs: {
        Input: {
          props: ['modelValue', 'name', 'isSubmitting', 'label', 'type'],
          emits: ['update:modelValue'],
          template: `
            <div>
              <input
                :name="name"
                :type="type || 'text'"
                :disabled="isSubmitting"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
              />
            </div>
          `,
        },
        Button: {
          props: ['label', 'isSubmitting'],
          template: '<button type="submit" :disabled="isSubmitting">{{ label }}</button>',
        },
        FormError: {
          props: ['message'],
          template: '<span class="form-error">{{ message }}</span>',
        },
        NuxtLink: {
          template: '<a><slot /></a>',
        },
      },
    },
  });
};

const fillForm = async (wrapper: VueWrapper, name: string, email: string, password: string, confirmPassword: string) => {
  const inputs = wrapper.findAll('input');
  expect(inputs.length).toBeGreaterThanOrEqual(4);

  await inputs[0]!.setValue(name);
  await inputs[0]!.trigger('input');

  await inputs[1]!.setValue(email);
  await inputs[1]!.trigger('input');

  await inputs[2]!.setValue(password);
  await inputs[2]!.trigger('input');

  await inputs[3]!.setValue(confirmPassword);
  await inputs[3]!.trigger('input');

  await wrapper.vm.$nextTick();
  await flushPromises();
};

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Render', () => {
    it('Should render register title', () => {
      const wrapper = mountComponent();

      expect(wrapper.text()).toContain('Crie sua conta');
    });

    it('Should render all form inputs', () => {
      const wrapper = mountComponent();
      const inputs = wrapper.findAll('input');

      expect(inputs).toHaveLength(4);
    });

    it('Should render submit button', () => {
      const wrapper = mountComponent();
      const button = wrapper.find('button');

      expect(button.exists()).toBe(true);
      expect(button.text()).toContain('Cadastrar');
    });
  });

  describe('Validation', () => {
    it('Should show validation errors when submitting empty form', async () => {
      const wrapper = mountComponent();

      await wrapper.find('form').trigger('submit');
      await flushPromises();

      const errors = wrapper.findAll('.form-error');
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.text().length > 0)).toBe(true);
    });

    it('Should clear name error when name changes', async () => {
      const wrapper = mountComponent();

      await wrapper.find('form').trigger('submit');
      await flushPromises();

      const nameInput = wrapper.findAll('input')[0];
      await nameInput!.setValue('John Doe');
      await nameInput!.trigger('input');
      await wrapper.vm.$nextTick();

      const errors = wrapper.findAll('.form-error');
      expect(errors[0]!.text()).toBe('');
    });
  });

  describe('Submit behavior', () => {
    it('Should handle API errors gracefully and keep form enabled', async () => {
      apiPostMock.mockRejectedValue(new Error('Email already exists'));

      const { handleApiErrors } = await import('~/utils');

      const wrapper = mountComponent();

      await fillForm(
        wrapper,
        'John Doe',
        'email@email.com',
        'Senha123!',
        'Senha123!',
      );

      await flushPromises();

      await wrapper.find('form').trigger('submit');
      await flushPromises();

      expect(handleApiErrors).toHaveBeenCalled();
      expect(navigateToMock).not.toHaveBeenCalled();

      const inputs = wrapper.findAll('input');
      const button = wrapper.find('button');

      expect(inputs[0]!.element.disabled).toBe(false);
      expect(inputs[1]!.element.disabled).toBe(false);
      expect(inputs[2]!.element.disabled).toBe(false);
      expect(inputs[3]!.element.disabled).toBe(false);
      expect(button.element.disabled).toBe(false);
    });
  });
});
