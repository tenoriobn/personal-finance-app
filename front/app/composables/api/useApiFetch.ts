/* eslint-disable @typescript-eslint/no-explicit-any */
import { defu } from 'defu';

export function useApiFetch<T>(endpoint: string, options: Record<string, any> = {}) {
  const config = useRuntimeConfig();

  const defaults = {
    baseURL: config.public.apiBase,
    headers: {
      'Authorization': `Bearer ${config.public.apiToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include' as const,
    server: true,
  };

  const mergedOptions = defu(options, defaults);
  const response = useFetch<T>(endpoint, mergedOptions);

  return response;
}
