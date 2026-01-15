import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApiFetch } from '.';

vi.stubGlobal('useRuntimeConfig', () => ({
  public: {
    apiBase: '',
  },
}));

const fetchMock = vi.fn();

vi.stubGlobal('$fetch', fetchMock);

vi.mock('vue3-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('~/composables', () => ({
  useAuth: () => ({
    token: { value: 'mock-token' },
  }),
}));

const endpoint = '/users';

describe('useApiFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Default behavior', () => {
    it('Should call $fetch when lazy is false', () => {
      useApiFetch(endpoint);

      expect(fetchMock).toHaveBeenCalledOnce();
      expect(fetchMock).toHaveBeenCalledWith(
        endpoint,
        expect.objectContaining({
          credentials: 'include',
          server: false,
          headers: {
            'Authorization': 'Bearer mock-token',
            'Content-Type': 'application/json',
          },
        }),
      );
    });

    it('Should not call $fetch when lazy is true', () => {
      useApiFetch(endpoint, {}, true);

      expect(fetchMock).toHaveBeenCalledOnce();

      const options = fetchMock.mock.calls[0]![1];
      expect(options.server).toBeUndefined();
    });
  });

  describe('Error handling', () => {
    it('Should expose onResponseError handler', () => {
      useApiFetch(endpoint);

      const options = fetchMock.mock.calls[0]![1];

      expect(typeof options.onResponseError).toBe('function');
    });
  });
});
