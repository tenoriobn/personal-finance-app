/* eslint-disable no-console */
import { useToast } from '~/composables';
import { useAuth } from '../useAuth';
import type { LoginResponse } from '~/screens/Auth/Login/login.type';

export function useDemoAuth() {
  const { setToken } = useAuth();
  const { notify } = useToast();
  const demoIsSubmitting = ref(false);

  const loginDemoUser = async () => {
    if (demoIsSubmitting.value) {
      return;
    }

    demoIsSubmitting.value = true;

    try {
      const { token } = await useApiPost('auth/demo-login', {}) as LoginResponse;

      setToken(token);
      await navigateTo('/');
    }
    catch (err: unknown) {
      notify('success', 'Não foi possível fazer login como DEMO.');
      console.error(err);
    }
    finally {
      demoIsSubmitting.value = false;
    }
  };

  return {
    loginDemoUser,
    demoIsSubmitting,
  };
}
