export default defineNuxtPlugin(() => {
  if (import.meta.server) {
    return;
  }

  const stored = localStorage.getItem('navbar:collapsed');

  const isCollapsed = stored === 'true';

  const html = document.documentElement;

  html.setAttribute(
    'data-navbar',
    isCollapsed ? 'collapsed' : 'expanded',
  );
});
