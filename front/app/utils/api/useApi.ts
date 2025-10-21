import { httpClient } from './httpClient';

export const useApi = async <T>(endpoint: string) => {
  return await useAsyncData<T>(endpoint, () => httpClient()(endpoint));
};
