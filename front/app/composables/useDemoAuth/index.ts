/* eslint-disable no-console */
import { useToast } from '~/composables';
import { useAuth } from '../useAuth';
import type { LoginResponse } from '~/screens/Auth/Login/login.type';

export function useDemoAuth() {
  const { setToken } = useAuth();
  const { notify } = useToast();
  const isSubmitting = ref(false);

  const loginDemoUser = async () => {
    if (isSubmitting.value) {
      return;
    }

    isSubmitting.value = true;

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
      isSubmitting.value = false;
    }
  };

  return {
    loginDemoUser,
    isSubmitting,
  };
}
