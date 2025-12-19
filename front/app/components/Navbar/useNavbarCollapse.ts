export function useNavbarCollapse() {
  const navbarCollapsed = useCookie<boolean>('navbar-collapsed', {
    default: () => false,
  });

  const isCollapsed = computed({
    get: () => navbarCollapsed.value,
    set: (value: boolean) => {
      navbarCollapsed.value = value;
    },
  });

  function toggleNavbar() {
    isCollapsed.value = !isCollapsed.value;
  }

  return {
    isCollapsed,
    toggleNavbar,
  };
}
