// tests/utils/handleApiErrors.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleApiErrors } from './index';

describe('handleApiErrors', () => {
  let errors: Record<string, string>;
  let notify: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    errors = {
      email: 'previous error',
      password: 'previous error',
    };

    notify = vi.fn();
  });

  describe('Error state reset', () => {
    it('Should clear all existing field errors before handling a new error', () => {
      handleApiErrors({}, errors, notify);

      expect(errors.email).toBe('');
      expect(errors.password).toBe('');
    });
  });

  describe('Fallback handling', () => {
    it('Should notify with fallback message when no error message is provided', () => {
      handleApiErrors({}, errors, notify);

      expect(notify).toHaveBeenCalledOnce();
      expect(notify).toHaveBeenCalledWith(
        'error',
        'Erro inesperado. Tente novamente.',
      );
    });

    it('Should use a custom fallback message when provided', () => {
      handleApiErrors({}, errors, notify, {}, 'Falha genérica');

      expect(notify).toHaveBeenCalledWith('error', 'Falha genérica');
    });
  });

  describe('Field-specific error matching', () => {
    it('Should assign the API message to the matched field based on matchers', () => {
      const apiError = {
        data: {
          message: 'Email ou Senha inválidos.',
        },
      };

      handleApiErrors(
        apiError,
        errors,
        notify,
        {
          email: ['Email'],
          password: ['Senha'],
        },
      );

      expect(errors.email).toBe('Email ou Senha inválidos.');
      expect(errors.password).toBe('Email ou Senha inválidos.');
      expect(notify).not.toHaveBeenCalled();
    });

    it('Should ignore field matchers that do not exist in errors object', () => {
      const apiError = {
        data: {
          message: 'Usuário inválido.',
        },
      };

      handleApiErrors(
        apiError,
        errors,
        notify,
        {
          username: ['Usuário'],
        },
      );

      expect(errors.email).toBe('');
      expect(errors.password).toBe('');
      expect(notify).toHaveBeenCalledWith('error', 'Usuário inválido.');
    });
  });

  describe('Global error notification', () => {
    it('Should notify with API message when no field matcher matches', () => {
      const apiError = {
        data: {
          message: 'Acesso não autorizado.',
        },
      };

      handleApiErrors(apiError, errors, notify, {
        email: ['Email'],
      });

      expect(errors.email).toBe('');
      expect(errors.password).toBe('');
      expect(notify).toHaveBeenCalledOnce();
      expect(notify).toHaveBeenCalledWith('error', 'Acesso não autorizado.');
    });

    it('Should use error.message when data.message is not available', () => {
      const apiError = {
        message: 'Erro interno do servidor.',
      };

      handleApiErrors(apiError, errors, notify);

      expect(notify).toHaveBeenCalledWith(
        'error',
        'Erro interno do servidor.',
      );
    });
  });
});
