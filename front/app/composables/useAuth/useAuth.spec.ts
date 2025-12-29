import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useAuth } from './index';

import { useCookie } from '#app';

vi.mock('#app', () => {
  return {
    useCookie: vi.fn(),
  };
});

describe('useAuth', () => {
  const createCookieRef = (initialValue: string | null = null) => {
    return ref<string | null>(initialValue);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Default behavior', () => {
    it('Should initialize token as undefined', () => {
      const cookieRef = createCookieRef(undefined);
      vi.mocked(useCookie).mockReturnValue(cookieRef);

      const { token } = useAuth();

      expect(token.value).toBeUndefined();
    });

    it('Should return isAuthenticated as false when token is null', () => {
      const cookieRef = createCookieRef(null);
      vi.mocked(useCookie).mockReturnValue(cookieRef);

      const { isAuthenticated } = useAuth();

      expect(isAuthenticated.value).toBe(false);
    });
  });

  describe('setToken', () => {
    it('Should set token value when setToken is called', () => {
      const cookieRef = createCookieRef(null);
      vi.mocked(useCookie).mockReturnValue(cookieRef);

      const { token, setToken } = useAuth();

      setToken('my-token');

      expect(token.value).toBe('my-token');
    });

    it('Should update isAuthenticated to true after setting token', () => {
      const cookieRef = createCookieRef(null);
      vi.mocked(useCookie).mockReturnValue(cookieRef);

      const { isAuthenticated, setToken } = useAuth();

      setToken('my-token');

      expect(isAuthenticated.value).toBe(true);
    });
  });

  describe('clearToken', () => {
    it('Should clear token value when clearToken is called', () => {
      const cookieRef = createCookieRef('existing-token');
      vi.mocked(useCookie).mockReturnValue(cookieRef);

      const { token, clearToken } = useAuth();

      clearToken();

      expect(token.value).toBeNull();
    });

    it('Should update isAuthenticated to false after clearing token', () => {
      const cookieRef = createCookieRef('existing-token');
      vi.mocked(useCookie).mockReturnValue(cookieRef);

      const { isAuthenticated, clearToken } = useAuth();

      clearToken();

      expect(isAuthenticated.value).toBe(false);
    });
  });
});
