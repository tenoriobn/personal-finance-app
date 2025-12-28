import { toast, type ToastOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export function useToast() {
  const notify = (type: ToastType, message: string, options?: ToastOptions) => {
    toast(message, {
      type,
      position: 'top-right',
      theme: 'colored',
      autoClose: 3000,
      pauseOnHover: true,
      ...options,
    });
  };

  return { notify };
}
