import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  phone: string;
  password: string;
}

interface AuthContextType {
  currentUser: string | null;
  login: (phone: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  isAuthenticated: boolean;
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
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('habitforge_current_user');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const getUsers = (): User[] => {
    const users = localStorage.getItem('habitforge_users');
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem('habitforge_users', JSON.stringify(users));
  };

  const login = (phone: string, password: string): { success: boolean; message: string } => {
    const users = getUsers();
    const existingUser = users.find(u => u.phone === phone);

    if (existingUser) {
      if (existingUser.password === password) {
        setCurrentUser(phone);
        localStorage.setItem('habitforge_current_user', phone);
        return { success: true, message: 'Login successful!' };
      } else {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }
    } else {
      const newUser: User = { phone, password };
      saveUsers([...users, newUser]);
      setCurrentUser(phone);
      localStorage.setItem('habitforge_current_user', phone);
      return { success: true, message: 'Account created successfully!' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('habitforge_current_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};