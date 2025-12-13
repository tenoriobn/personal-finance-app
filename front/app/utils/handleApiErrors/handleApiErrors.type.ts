export type NotifyFn = (type: 'error' | 'success', msg: string) => void;

export type ApiErrorLike = {
  message?: string
  data?: {
    message?: string
  }
};

export type FieldMatchers = Record<string, string[]>;
