/* eslint-disable no-console */
export const httpClient = () => {
  const config = useRuntimeConfig();

  return $fetch.create({
    baseURL: config.public.apiBase,
    headers: {
      Authorization: `Bearer ${config.public.apiToken}`,
    },
    credentials: 'include',
    onResponseError({ response }) {
      console.error('API Error:', response.status, response._data);
    },
  });
};
