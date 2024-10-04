import apiClient from './apiClient';

export const login = (credentials) => apiClient.post('/login', credentials);
export const signup = (userData) => apiClient.post('/signup', userData);
export const logout = () => apiClient.post('/logout');
