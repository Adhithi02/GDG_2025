import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthContextType } from '../types';

const USERS_STORAGE_KEY = 'civic-rights-users';
const CURRENT_USER_KEY = 'civic-rights-current-user';

const getInitialUsers = (): User[] => {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (storedUsers) return JSON.parse(storedUsers);

  const defaultUsers: User[] = [
    {
      id: '1',
      name: 'Citizen User',
      email: 'citizen@example.com',
      password: 'password123',
      role: 'citizen'
    },
    {
      id: '2',
      name: 'Animal_Welfare Official',
      email: 'animalwelfare@gov.in',
      password: 'gov123',
      role: 'government',
      department: 'ANIMAL_WELFARE'
    },

    {
      id: '3',
      name: 'BBMP Official',
      email: 'bbmp@gov.in',
      password: 'gov123',
      role: 'government',
      department: 'BBMP'
    }
  ];

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(getInitialUsers);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      setUser(JSON.parse(saved));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const found = users.find(u => u.email === email && u.password === password);
    console.log('Login attempt with:', email, password);
    console.log('Available users:', users);

    if (found) {
      setUser(found);
      setIsAuthenticated(true);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
      return true;
    }
    return false;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'citizen' | 'government',
    department?: string
  ): Promise<boolean> => {
    if (users.some(u => u.email === email)) return false;

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role,
      ...(department && { department })
    };

    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  // 📥 Import users from uploaded JSON file
  const importUsersFromJSON = (jsonData: string) => {
    try {
      const importedUsers = JSON.parse(jsonData);
      if (Array.isArray(importedUsers)) {
        setUsers(importedUsers);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(importedUsers));
        return true;
      }
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
    return false;
  };

  // 📤 Export current users as downloadable JSON file
  const exportUsersToJSON = () => {
    const blob = new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'civic-rights-users.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated,
        // @ts-ignore to allow extensions temporarily
        importUsersFromJSON,
        exportUsersToJSON
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType & {
  importUsersFromJSON: (json: string) => boolean;
  exportUsersToJSON: () => void;
} => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context as any;
};
