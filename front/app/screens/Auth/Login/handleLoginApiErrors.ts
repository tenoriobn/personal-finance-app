import type { LoginApiErrors } from './login.type';

export function handleLoginApiErrors(
  err: unknown,
  errors: Record<string, string>,
  notify: (type: 'error' | 'success', msg: string) => void,
) {
  const error = err as LoginApiErrors;

  Object.keys(errors).forEach(k => (errors[k] = ''));

  const message = error?.data?.message || error?.message;

  if (!message) {
    notify('error', 'Erro inesperado. Tente novamente.');
    return;
  }

  if (message.includes('Credenciais inválidas')) {
    errors.password = 'Email ou senha incorretos';
    return;
  }

  notify('error', message);
}
