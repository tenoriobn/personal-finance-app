import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useToast } from './index';
import { toast } from 'vue3-toastify';

vi.mock('vue3-toastify', () => ({
  toast: vi.fn(),
}));

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Default behavior', () => {
    it('Should call toast with default configuration for success type', () => {
      const { notify } = useToast();

      notify('success', 'Success message');

      expect(toast).toHaveBeenCalledTimes(1);
      expect(toast).toHaveBeenCalledWith('Success message', {
        type: 'success',
        position: 'top-right',
        theme: 'colored',
        autoClose: 3000,
        pauseOnHover: true,
      });
    });

    it('Should call toast with error type', () => {
      const { notify } = useToast();

      notify('error', 'Error message');

      expect(toast).toHaveBeenCalledWith('Error message', expect.objectContaining({
        type: 'error',
      }));
    });
  });

  describe('Options override', () => {
    it('Should override default options when custom options are provided', () => {
      const { notify } = useToast();

      notify('info', 'Info message', {
        autoClose: 5000,
        pauseOnHover: false,
      });

      expect(toast).toHaveBeenCalledWith('Info message', {
        type: 'info',
        position: 'top-right',
        theme: 'colored',
        autoClose: 5000,
        pauseOnHover: false,
      });
    });
  });
});
