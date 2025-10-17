import { request } from './request';

export const api = {
  get: (url: string) => request('GET', url),
  post: (url: string, body?: object) => request('POST', url, body),
  put: (url: string, body?: object) => request('PUT', url, body),
  del: (url: string) => request('DELETE', url),
};
