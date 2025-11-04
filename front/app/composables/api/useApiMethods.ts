/* eslint-disable @typescript-eslint/no-explicit-any */
import { useApiFetch } from './useApiFetch';

export function useApiGet<T>(endpoint: string, options: Record<string, any> = {}) {
  return useApiFetch<T>(endpoint, { method: 'GET', ...options }, true) as ReturnType<typeof useFetch<T>>;
}
export function useApiPost<T>(endpoint: string, body: object, options: Record<string, any> = {}) {
  return useApiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(body), ...options });
}
export function useApiPut<T>(endpoint: string, body: object, options: Record<string, any> = {}) {
  return useApiFetch<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options });
}
export function useApiDelete<T>(endpoint: string, options: Record<string, any> = {}) {
  return useApiFetch<T>(endpoint, { method: 'DELETE', ...options });
}
