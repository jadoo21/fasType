interface UserData {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  firstName: string;
  lastName: string;
}

export const createUser = (data: UserData) => ({
  id: data.id,
  username: data.username,
  email: data.email,
  createdAt: new Date(data.createdAt),
  getFullName: () => `${data.firstName} ${data.lastName}`
});