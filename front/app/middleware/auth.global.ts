import { useAuth } from '~/composables';

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth();

  const publicRoutes = ['/login', '/cadastro'];

  if (!isAuthenticated.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login');
  }

  if (isAuthenticated.value && publicRoutes.includes(to.path)) {
    return navigateTo('/');
  }
});
