import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApiGet, useApiPost, useApiPut, useApiDelete } from '.';

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

describe('useApiMethods', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useApiGet', () => {
    it('Should configure GET method and lazy behavior', () => {
      useApiGet(endpoint);

      expect(fetchMock).toHaveBeenCalledOnce();

      const options = fetchMock.mock.calls[0]![1];
      expect(options.method).toBe('GET');
    });
  });

  describe('useApiPost', () => {
    it('Should call useApiFetch with POST method and serialized body', () => {
      const body = { name: 'John' };

      useApiPost(endpoint, body);

      expect(fetchMock).toHaveBeenCalledOnce();
      const options = fetchMock.mock.calls[0]![1];

      expect(options.method).toBe('POST');
      expect(options.body).toBe(JSON.stringify(body));
    });
  });

  describe('useApiPut', () => {
    it('Should call useApiFetch with PUT method and serialized body', () => {
      const body = { name: 'Jane' };

      useApiPut(endpoint, body);

      expect(fetchMock).toHaveBeenCalledOnce();
      const options = fetchMock.mock.calls[0]![1];

      expect(options.method).toBe('PUT');
      expect(options.body).toBe(JSON.stringify(body));
    });
  });

  describe('useApiDelete', () => {
    it('Should call useApiFetch with DELETE method', () => {
      useApiDelete(endpoint);

      expect(fetchMock).toHaveBeenCalledOnce();
      const options = fetchMock.mock.calls[0]![1];

      expect(options.method).toBe('DELETE');
    });
  });
});
