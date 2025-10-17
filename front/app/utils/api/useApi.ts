import { httpClient } from './httpClient';

export const useApi = async (endpoint: string) => {
  return await useAsyncData(endpoint, () => httpClient()(endpoint));
};
