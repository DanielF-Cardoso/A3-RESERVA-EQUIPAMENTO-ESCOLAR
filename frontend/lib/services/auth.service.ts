const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555/api/v1';
const API_BASE = API_URL;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  role: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: 'student' | 'teacher' | 'staff' | 'admin';
  phone: string | null;
  created_at: string;
  updated_at: string;
}

class AuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Email ou senha inválidos');
      }

      return response.json();
    } catch (error) {
      // Erro de conexão com o servidor
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(
          `Não foi possível conectar ao servidor. Verifique se:\n` +
          `1. O backend está rodando em ${API_URL}\n` +
          `2. A URL da API está correta no arquivo .env.local\n` +
          `3. Não há problemas de CORS ou firewall`
        );
      }
      throw error;
    }
  }

  async getProfile(token: string): Promise<UserProfile> {
    try {
      const response = await fetch(`${API_BASE}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar perfil do usuário');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      // Erro de conexão com o servidor
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(
          `Não foi possível conectar ao servidor em ${API_URL}. ` +
          `Certifique-se de que o backend está rodando.`
        );
      }
      throw error;
    }
  }

  saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  }

  saveUserData(data: { role: string; profile?: UserProfile }): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userData', JSON.stringify(data));
    }
  }

  getUserData(): { role: string; profile?: UserProfile } | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('userData');
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  removeUserData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userData');
    }
  }

  clearAuth(): void {
    this.removeToken();
    this.removeUserData();
  }
}

export const authService = new AuthService();
