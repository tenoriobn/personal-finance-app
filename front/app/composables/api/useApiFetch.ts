/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { defu } from 'defu';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export function useApiFetch<T>(endpoint: string, options: Record<string, any> = {}, lazy = false) {
  const config = useRuntimeConfig();
  const { token } = useAuth();

  const defaults = {
    baseURL: config.public.apiBase,
    headers: {
      'Authorization': token.value ? `Bearer ${token.value}` : '',
      'Content-Type': 'application/json',
    },
    credentials: 'include' as const,
    server: true,
    onResponseError({ response }: any) {
      console.error(
        `%c[API ERROR] ${response?.url || ''}`,
        'color: #ff4d4f; font-weight: bold;',
        {
          status: response?.status,
          message: response?._data?.message || 'Erro desconhecido',
        },
      );

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
