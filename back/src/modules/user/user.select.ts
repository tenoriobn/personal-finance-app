export const userSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  role: {
    select: {
      id: true,
      name: true,
    }
  }
};