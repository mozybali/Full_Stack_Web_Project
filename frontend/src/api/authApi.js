import api from './client';

export const authApi = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  register: (email, username, password) =>
    api.post('/auth/register', { email, username, password }),
};

// Legacy exports for backward compatibility
export const login = (email, password) => authApi.login(email, password);
export const register = (email, username, password) => authApi.register(email, username, password);
