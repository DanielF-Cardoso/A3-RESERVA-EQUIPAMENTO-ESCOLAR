// Mock Data for School System

export interface UserProfile {
  id: string;
  full_name: string;
  role: 'student' | 'teacher' | 'staff' | 'admin';
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}


export const mockUsers: UserProfile[] = [
  {
    id: '1',
    full_name: 'João Silva',
    role: 'admin',
    email: 'joao.silva@escola.com',
    phone: '(11) 98765-4321',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  }
];