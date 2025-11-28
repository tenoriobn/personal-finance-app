import type { PotApiErrors } from './pots.type';

export function handlePotApiErrors(
  err: unknown,
  errors: Record<string, string>,
  notify: (type: 'error' | 'success', msg: string) => void,
) {
  const error = err as PotApiErrors;

  Object.keys(errors).forEach(k => (errors[k] = ''));

  const message = error?.data?.message || error?.message;

  if (!message) {
    notify('error', 'Erro inesperado. Tente novamente.');
    return;
  }

  if (message.includes('nome') || message.includes('Nome')) {
    errors.name = message;
  }

  if (message.includes('tema') || message.includes('Tema')) {
    errors.themeId = message;
  }

  if (!errors.name && !errors.themeId) {
    notify('error', message);
  }
}
