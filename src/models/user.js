export const createUser = (data) => ({
  id: data.id,
  username: data.username,
  email: data.email,
  createdAt: new Date(data.createdAt),
  getFullName: () => `${data.firstName} ${data.lastName}`
});