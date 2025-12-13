import type { ApiErrorLike, FieldMatchers, NotifyFn } from './handleApiErrors.type';

export function handleApiErrors(
  err: unknown,
  errors: Record<string, string>,
  notify: NotifyFn,
  fieldMatchers: FieldMatchers = {},
  fallbackMessage = 'Erro inesperado. Tente novamente.',
) {
  const error = err as ApiErrorLike;

  Object.keys(errors).forEach(k => (errors[k] = ''));

  const message = error?.data?.message || error?.message;

  if (!message) {
    notify('error', fallbackMessage);
    return;
  }

  let matchedField = false;

  for (const [field, matchers] of Object.entries(fieldMatchers)) {
    if (!(field in errors)) {
      continue;
    }

    if (matchers.some(text => message.includes(text))) {
      errors[field] = message;
      matchedField = true;
    }
  }

  if (!matchedField) {
    notify('error', message);
  }
}
