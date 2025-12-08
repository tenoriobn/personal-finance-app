import type { RegisterApiErrors } from './register.type';

export function handleRegisterApiErrors(
  err: unknown,
  errors: Record<string, string>,
  notify: (type: 'error' | 'success', msg: string) => void,
) {
  const error = err as RegisterApiErrors;

  Object.keys(errors).forEach(k => (errors[k] = ''));

  const message = error?.data?.message || error?.message;

  if (!message) {
    notify('error', 'Erro inesperado. Tente novamente.');
    return;
  }

  if (message.includes('e-mail') || message.includes('E-mail')) {
    errors.email = message;
  }

  if (!errors.email) {
    notify('error', message);
  }
}
