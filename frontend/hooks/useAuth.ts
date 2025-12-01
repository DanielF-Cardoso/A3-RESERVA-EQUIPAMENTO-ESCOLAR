'use client';

import { useEffect, useState } from 'react';
import { authService, UserProfile } from '@/lib/services/auth.service';

interface User {
  id: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado
    const checkAuth = async () => {
      const token = authService.getToken();
      const userData = authService.getUserData();

      if (token && userData) {
        try {
          // Tentar buscar o perfil do usuário para validar o token
          const userProfile = await authService.getProfile(token);
          
          setUser({
            id: userProfile.id,
            email: userProfile.email,
            role: userData.role,
          });
          setProfile(userProfile);
        } catch (error) {
          // Token inválido ou expirado
          authService.clearAuth();
          setUser(null);
          setProfile(null);
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      // Salvar token
      authService.saveToken(response.accessToken);
      
      // Buscar perfil do usuário
      const userProfile = await authService.getProfile(response.accessToken);
      
      // Salvar dados do usuário
      authService.saveUserData({ 
        role: response.role, 
        profile: userProfile 
      });
      
      setUser({
        id: userProfile.id,
        email: userProfile.email,
        role: response.role,
      });
      setProfile(userProfile);
      
      return { data: { user: userProfile }, error: null };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      
      // Limpar possíveis dados corrompidos
      authService.clearAuth();
      
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'Erro desconhecido ao fazer login' 
        } 
      };
    }
  };

  const signOut = async () => {
    authService.clearAuth();
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
