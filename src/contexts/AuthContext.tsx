
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

export type UserRole = 'admin' | 'user' | 'ngo' | 'volunteer' | 'donor';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  phone?: string;
  address?: string;
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (profileData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const updateUserProfile = async (profileData: Partial<User>): Promise<void> => {
    try {
      if (!user) throw new Error('No user logged in');
      
      // In a real app, you would call an API to update the user profile
      // For now, we'll just update the local state
      const updatedUser = { ...user, ...profileData };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Mock auth functions (to be replaced with actual API calls)
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Mock API call - Replace with actual API call
      // const response = await axios.post('/api/auth/login', { email, password });
      
      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Determine role based on email
      let role: UserRole = 'user';
      if (email.includes('admin')) {
        role = 'admin';
      } else if (email.includes('ngo')) {
        role = 'ngo';
      } else if (email.includes('volunteer')) {
        role = 'volunteer';
      } else if (email.includes('donor')) {
        role = 'donor';
      }
      
      const mockUser = {
        id: '123',
        name: email.split('@')[0],
        email,
        role
      };
      
      const mockToken = 'mock-jwt-token';
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setToken(mockToken);
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: string = 'user') => {
    try {
      setIsLoading(true);
      
      // Mock API call - Replace with actual API call
      // const response = await axios.post('/api/auth/signup', { name, email, password, role });
      
      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Convert role string to valid role type
      let userRole: UserRole = 'user';
      if (role === 'admin' || role === 'ngo' || role === 'volunteer' || role === 'donor') {
        userRole = role as UserRole;
      }
      
      const mockUser = {
        id: '123',
        name,
        email,
        role: userRole
      };
      
      const mockToken = 'mock-jwt-token';
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setToken(mockToken);
      
      toast({
        title: "Signup Successful",
        description: "Welcome to FoodShare!",
      });
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup Failed",
        description: "Please try again with different credentials.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
