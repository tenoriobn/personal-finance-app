export function useAuth() {
  const token = useCookie<string | null>('auth_token', {
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 7,
  });

  const setToken = (newToken: string) => {
    token.value = newToken;
  };

  const clearToken = () => {
    token.value = null;
  };

  const isAuthenticated = computed(() => Boolean(token.value));

  return {
    token,
    isAuthenticated,
    setToken,
    clearToken,
  };
}
