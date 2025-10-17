import { httpClient } from './httpClient';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const request = async (method: HttpMethod, endpoint: string, body?: object) => {
  try {
    const data = await httpClient()(endpoint, { method, body });
    return { data, error: null };
  }
  catch (err) {
    return { data: null, error: err };
  }
};
