
import api from './api';
import { User } from '@/types';
import { toast } from 'sonner';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const login = async (credentials: LoginCredentials): Promise<User | null> => {
  try {
    // First initiate CSRF protection if using Sanctum with cookies
    await api.get('/sanctum/csrf-cookie');
    
    // Then login
    const response = await api.post('/login', credentials);
    
    if (response.data.token) {
      // If using token-based auth
      localStorage.setItem('auth_token', response.data.token);
    }
    
    // Store user data
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data.user;
  } catch (error) {
    console.error('Login error:', error);
    toast.error('Login failed. Please check your credentials and try again.');
    return null;
  }
};

export const register = async (data: RegisterData): Promise<User | null> => {
  try {
    const response = await api.post('/register', data);
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data.user;
  } catch (error) {
    console.error('Registration error:', error);
    toast.error('Registration failed. Please try again.');
    return null;
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    await api.post('/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    // Clean up local storage even if API call fails
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return false;
  }
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    return JSON.parse(userJson);
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};
