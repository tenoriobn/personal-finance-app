export const useSidebar = () => {
  const isCollapsed = useState('sidebar-collapsed', () => false);

  return { isCollapsed };
};
