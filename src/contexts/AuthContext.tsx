
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import { getCurrentUser, login, logout, register, isAdmin } from '@/services/auth';
import { useNavigate } from 'react-router-dom';

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

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const storedUser = getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    const user = await login(credentials);
    setIsLoading(false);
    
    if (user) {
      setUser(user);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
      return true;
    }
    
    return false;
  };

  const handleLogout = async (): Promise<void> => {
    setIsLoading(true);
    await logout();
    setUser(null);
    setIsLoading(false);
    navigate('/');
  };

  const handleRegister = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    const user = await register(data);
    setIsLoading(false);
    
    if (user) {
      setUser(user);
      navigate('/dashboard');
      return true;
    }
    
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
