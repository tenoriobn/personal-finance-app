/* eslint-disable @typescript-eslint/no-explicit-any */
import { defu } from 'defu';

export function useApiFetch<T>(endpoint: string, options: Record<string, any> = {}, lazy = false) {
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

  if (lazy) {
    return useFetch<T>(endpoint, mergedOptions);
  };

  return $fetch<T>(endpoint, mergedOptions);
}
