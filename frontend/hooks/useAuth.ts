'use client';

import { useEffect, useState } from 'react';
import { mockUsers } from '@/lib/mock-data';

interface UserProfile {
  id: string;
  full_name: string;
  role: 'student' | 'teacher' | 'staff' | 'admin';
  email: string;
  phone: string | null;
}

interface MockUser {
  id: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Buscar perfil do usuário mockado
      const userProfile = mockUsers.find(u => u.email === userData.email);
      if (userProfile) {
        setProfile({
          id: userProfile.id,
          full_name: userProfile.full_name,
          role: userProfile.role,
          email: userProfile.email,
          phone: userProfile.phone,
        });
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Buscar usuário mockado por email
    const userProfile = mockUsers.find(u => u.email === email);
    
    if (!userProfile) {
      return { data: null, error: { message: 'Usuário não encontrado' } };
    }
    
    // Para simplificar, qualquer senha funciona (ou você pode validar uma senha específica)
    const userData = { id: userProfile.id, email: userProfile.email };
    localStorage.setItem('mockUser', JSON.stringify(userData));
    setUser(userData);
    setProfile({
      id: userProfile.id,
      full_name: userProfile.full_name,
      role: userProfile.role,
      email: userProfile.email,
      phone: userProfile.phone,
    });
    
    return { data: userData, error: null };
  };

  const signOut = async () => {
    localStorage.removeItem('mockUser');
    setUser(null);
    setProfile(null);
  };

  return {
    user,
    profile,
    loading,
    signIn,
    signOut,
  };
}
