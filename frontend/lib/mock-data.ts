// Mock Data for School System

export interface UserProfile {
  id: string;
  full_name: string;
  role: 'teacher' | 'staff' | 'admin';
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'in_use' | 'maintenance';
  description: string;
  location: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Scheduling {
  id: string;
  equipment_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  notes: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
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
  },
  {
    id: '2',
    full_name: 'Maria Santos',
    role: 'teacher',
    email: 'maria.santos@escola.com',
    phone: '(11) 98765-4322',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '3',
    full_name: 'Pedro Oliveira',
    role: 'staff',
    email: 'pedro.oliveira@escola.com',
    phone: '(11) 98765-4323',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  }
];

export const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Projetor Epson EB-X41',
    type: 'Projetor',
    status: 'available',
    description: 'Projetor multimídia 3600 lumens',
    location: 'Sala de Audiovisual',
    quantity: 3,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Notebook Dell Latitude',
    type: 'Computador',
    status: 'available',
    description: 'Notebook i7 16GB RAM',
    location: 'Laboratório de Informática',
    quantity: 15,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '3',
    name: 'Câmera Canon EOS',
    type: 'Câmera',
    status: 'in_use',
    description: 'Câmera profissional para eventos',
    location: 'Departamento de Mídia',
    quantity: 2,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '4',
    name: 'Microfone Shure SM58',
    type: 'Áudio',
    status: 'available',
    description: 'Microfone profissional',
    location: 'Auditório',
    quantity: 5,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '5',
    name: 'Quadro Interativo',
    type: 'Equipamento Didático',
    status: 'maintenance',
    description: 'Quadro branco interativo 85"',
    location: 'Sala 101',
    quantity: 1,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '6',
    name: 'Tablet iPad Pro',
    type: 'Tablet',
    status: 'available',
    description: 'iPad Pro 12.9" 256GB',
    location: 'Biblioteca',
    quantity: 10,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '7',
    name: 'Impressora HP LaserJet',
    type: 'Impressora',
    status: 'available',
    description: 'Impressora laser colorida',
    location: 'Secretaria',
    quantity: 2,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '8',
    name: 'Microscópio Biológico',
    type: 'Equipamento Laboratorial',
    status: 'available',
    description: 'Microscópio binocular 1000x',
    location: 'Laboratório de Biologia',
    quantity: 8,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '9',
    name: 'Kit Robótica LEGO',
    type: 'Kit Educacional',
    status: 'available',
    description: 'Kit LEGO Mindstorms EV3',
    location: 'Sala de Tecnologia',
    quantity: 6,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '10',
    name: 'Violão Giannini',
    type: 'Instrumento Musical',
    status: 'in_use',
    description: 'Violão acústico nylon',
    location: 'Sala de Música',
    quantity: 4,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z'
  }
];

export const mockScheduling: Scheduling[] = [
  {
    id: '1',
    equipment_id: '1',
    user_id: '2',
    start_date: '2025-11-16T09:00:00Z',
    end_date: '2025-11-16T11:00:00Z',
    notes: 'Apresentação sobre História do Brasil',
    status: 'scheduled',
    created_at: '2025-11-15T10:00:00Z',
    updated_at: '2025-11-15T10:00:00Z'
  },
  {
    id: '2',
    equipment_id: '2',
    user_id: '4',
    start_date: '2025-11-16T14:00:00Z',
    end_date: '2025-11-16T16:00:00Z',
    notes: 'Desenvolvimento de projeto de programação',
    status: 'scheduled',
    created_at: '2025-11-15T10:00:00Z',
    updated_at: '2025-11-15T10:00:00Z'
  },
  {
    id: '3',
    equipment_id: '3',
    user_id: '3',
    start_date: '2025-11-15T10:00:00Z',
    end_date: '2025-11-15T17:00:00Z',
    notes: 'Cobertura do evento escolar',
    status: 'completed',
    created_at: '2025-11-14T10:00:00Z',
    updated_at: '2025-11-15T17:00:00Z'
  },
  {
    id: '4',
    equipment_id: '4',
    user_id: '2',
    start_date: '2025-11-17T15:00:00Z',
    end_date: '2025-11-17T17:00:00Z',
    notes: 'Palestra no auditório',
    status: 'scheduled',
    created_at: '2025-11-15T10:00:00Z',
    updated_at: '2025-11-15T10:00:00Z'
  },
  {
    id: '5',
    equipment_id: '6',
    user_id: '5',
    start_date: '2025-11-18T09:00:00Z',
    end_date: '2025-11-18T12:00:00Z',
    notes: 'Pesquisa na biblioteca',
    status: 'scheduled',
    created_at: '2025-11-15T10:00:00Z',
    updated_at: '2025-11-15T10:00:00Z'
  },
  {
    id: '6',
    equipment_id: '8',
    user_id: '2',
    start_date: '2025-11-19T08:00:00Z',
    end_date: '2025-11-19T10:00:00Z',
    notes: 'Aula prática de citologia',
    status: 'scheduled',
    created_at: '2025-11-15T10:00:00Z',
    updated_at: '2025-11-15T10:00:00Z'
  },
  {
    id: '7',
    equipment_id: '9',
    user_id: '4',
    start_date: '2025-11-14T13:00:00Z',
    end_date: '2025-11-14T15:00:00Z',
    notes: 'Projeto de robótica',
    status: 'completed',
    created_at: '2025-11-13T10:00:00Z',
    updated_at: '2025-11-14T15:00:00Z'
  }
];
