import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserType } from '../types';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
};

type RegisterData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  type: UserType;
  services?: string[];
};

const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Amanda Gomes',
    email: 'amanda@email.com',
    phone: '(11) 98888-0001',
    type: 'cliente',
    address: 'Pinheiros, São Paulo - SP',
    city: 'São Paulo',
  },
  {
    id: 'u2',
    name: 'Carlos Silva',
    email: 'carlos@email.com',
    phone: '(11) 99999-0001',
    type: 'prestador',
    address: 'Pinheiros, São Paulo - SP',
    city: 'São Paulo',
    rating: 4.9,
    completedJobs: 312,
    services: ['Instalação elétrica', 'Troca de tomadas'],
  },
];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const found = MOCK_USERS.find(u => u.email === email);
    if (!found) throw new Error('Credenciais inválidas');
    setUser(found);
    setIsLoading(false);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const newUser: User = {
      id: `u${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      type: data.type,
      services: data.services,
    };
    setUser(newUser);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
