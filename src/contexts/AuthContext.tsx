import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  role?: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (usernameOrEmail: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for admin credentials (can login with Admin123 as username or email)
    if (usernameOrEmail === 'Admin123' && password === 'admin321') {
      const adminUser: User = {
        id: 'admin_001',
        email: 'admin@donatelanka.com',
        username: 'Admin123',
        name: 'Administrator',
        role: 'admin',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Admin`
      };
      
      setUser(adminUser);
      localStorage.setItem('auth_user', JSON.stringify(adminUser));
    }
    // Mock authentication for regular users
    else if (password.length >= 6) {
      // Generate username from email if email provided, or use as username
      const isEmail = usernameOrEmail.includes('@');
      const username = isEmail ? usernameOrEmail.split('@')[0] : usernameOrEmail;
      const email = isEmail ? usernameOrEmail : `${usernameOrEmail}@donatelanka.com`;
      
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        role: 'user',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${username}`
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const signup = async (email: string, password: string, name: string, username: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock registration
    const mockUser: User = {
      id: `user_${Date.now()}`,
      email,
      username,
      name,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
    };
    
    setUser(mockUser);
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};