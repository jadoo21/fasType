import apiClient from './apiClient';

export const login = (credentials: any) => apiClient.post('/login', credentials);
export const signup = (userData: any) => apiClient.post('/signup', userData);
export const logout = () => apiClient.post('/logout');
