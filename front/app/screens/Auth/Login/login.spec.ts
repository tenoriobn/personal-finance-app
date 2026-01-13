import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VueWrapper } from '@vue/test-utils';
import { mount, flushPromises } from '@vue/test-utils';
import Login from './index.vue';

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
  useDemoAuth: () => ({
    loginDemoUser: vi.fn(),
    isSubmitting: false,
  }),
}));

vi.mock('~/utils', () => ({
  handleApiErrors: vi.fn(),
}));

const mountComponent = (): VueWrapper => {
  return mount(Login, {
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

const fillForm = async (wrapper: VueWrapper, email: string, password: string) => {
  const inputs = wrapper.findAll('input');
  expect(inputs.length).toBeGreaterThanOrEqual(2);

  await inputs[0]!.setValue(email);
  await inputs[0]!.trigger('input');

  await inputs[1]!.setValue(password);
  await inputs[1]!.trigger('input');

  await wrapper.vm.$nextTick();
  await flushPromises();
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização', () => {
    it('Should render login title and submit button', () => {
      const wrapper = mountComponent();

      expect(wrapper.text()).toContain('Acesse sua conta');
      expect(wrapper.find('button').exists()).toBe(true);
    });

    it('Should render email and password inputs', () => {
      const wrapper = mountComponent();
      const inputs = wrapper.findAll('input');

      expect(inputs).toHaveLength(2);
    });
  });

  describe('Validação do formulário', () => {
    it('Should show email validation error when email is invalid', async () => {
      const wrapper = mountComponent();

      await fillForm(wrapper, 'abc', '123456789');
      await wrapper.find('form').trigger('submit');
      await flushPromises();

      const errors = wrapper.findAll('.form-error');
      expect(errors[0]!.text()).toBeTruthy();
    });

    it('Should clear email error when email changes', async () => {
      const wrapper = mountComponent();

      await fillForm(wrapper, 'abc', '123456789');
      await wrapper.find('button').trigger('click');

      const emailInput = wrapper.findAll('input')[0];
      await emailInput!.setValue('email@email.com');
      await emailInput!.trigger('input');
      await wrapper.vm.$nextTick();

      const errors = wrapper.findAll('.form-error');
      expect(errors[0]!.text()).toBe('');
    });
  });

  describe('Submissão do formulário', () => {
    it('Should authenticate user and redirect on success', async () => {
      apiPostMock.mockResolvedValue({
        token: 'mock-token',
      });

      const wrapper = mountComponent();

      await fillForm(wrapper, 'email@email.com', '123456789');

      const submitPromise = wrapper.find('form').trigger('submit');
      await wrapper.vm.$nextTick();

      expect(apiPostMock).toHaveBeenCalledOnce();
      expect(apiPostMock).toHaveBeenCalledWith(
        'auth/login',
        expect.objectContaining({
          email: 'email@email.com',
          password: '123456789',
        }),
      );

      await submitPromise;
      await flushPromises();

      expect(setTokenMock).toHaveBeenCalledWith('mock-token');
    });

    it('Should block inputs and button while submitting', async () => {
      apiPostMock.mockImplementation(
        () => new Promise(() => {}),
      );

      const wrapper = mountComponent();

      await fillForm(wrapper, 'email@email.com', '123456789');
      await wrapper.find('form').trigger('submit');
      await flushPromises();

      const inputs = wrapper.findAll('input');
      const button = wrapper.find('form button');

      expect(inputs.length).toBeGreaterThanOrEqual(2);

      expect(inputs[0]!.element.disabled).toBe(true);
      expect(inputs[1]!.element.disabled).toBe(true);
      expect((button.element as HTMLButtonElement).disabled).toBe(true);
    });

    it('Should handle API error and keep form enabled', async () => {
      apiPostMock.mockRejectedValue(new Error('Invalid credentials'));

      const { handleApiErrors } = await import('~/utils');

      const wrapper = mountComponent();

      await fillForm(wrapper, 'email@email.com', '123456789');
      await wrapper.find('form').trigger('submit');
      await flushPromises();

      expect(handleApiErrors).toHaveBeenCalled();
      expect(navigateToMock).not.toHaveBeenCalled();

      const inputs = wrapper.findAll('input');
      const button = wrapper.find('button');

      expect(inputs[0]!.element.disabled).toBe(false);
      expect(inputs[1]!.element.disabled).toBe(false);
      expect(button.element.disabled).toBe(false);
    });
  });
});
