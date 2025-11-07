/* eslint-disable @typescript-eslint/no-explicit-any */
import { defu } from 'defu';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

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
    onResponseError({ response }: any) {
      if (response?.status === 500) {
        toast.error('Erro interno do servidor. Tente novamente mais tarde.', {
          position: 'top-right',
          theme: 'colored',
        });
      }
    },
  };

  const mergedOptions = defu(options, defaults);

  if (lazy) {
    return useFetch<T>(endpoint, mergedOptions);
  };

  return $fetch<T>(endpoint, mergedOptions);
}
