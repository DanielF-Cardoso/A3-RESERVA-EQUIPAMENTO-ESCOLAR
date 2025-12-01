import { apiClient } from './api-client';

export interface Equipment {
  id: string;
  name: string;
  type: string;
  quantity: number;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
  location: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEquipmentRequest {
  name: string;
  type: string;
  quantity: number;
  status?: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
  location?: string;
  description?: string;
}

export interface UpdateEquipmentRequest {
  name?: string;
  type?: string;
  quantity?: number;
  status?: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
  location?: string;
  description?: string;
}

class EquipmentsService {
  async list(): Promise<Equipment[]> {
    const response = await apiClient.get<{ equipments: Equipment[] }>('/equipments');
    return response.equipments;
  }

  async create(data: CreateEquipmentRequest): Promise<Equipment> {
    const response = await apiClient.post<{ equipment: Equipment }>('/equipments', data);
    return response.equipment;
  }

  async update(id: string, data: UpdateEquipmentRequest): Promise<Equipment> {
    const response = await apiClient.patch<{ equipment: Equipment }>(`/equipments/${id}`, data);
    return response.equipment;
  }

  async inactivate(id: string): Promise<Equipment> {
    const response = await apiClient.patch<{ equipment: Equipment }>(`/equipments/inactivate/${id}`);
    return response.equipment;
  }

  async markAsMaintenance(id: string): Promise<Equipment> {
    const response = await apiClient.patch<{ equipment: Equipment }>(`/equipments/${id}/maintenance`);
    return response.equipment;
  }

  async markAsAvailable(id: string): Promise<Equipment> {
    const response = await apiClient.patch<{ equipment: Equipment }>(`/equipments/${id}/available`);
    return response.equipment;
  }

  async checkAvailability(startDate: string, endDate: string): Promise<EquipmentAvailability[]> {
    const response = await apiClient.get<{ equipments: EquipmentAvailability[] }>(
      `/equipments/availability?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
    );
    return response.equipments;
  }
}

export interface EquipmentAvailability {
  equipmentId: string;
  name: string;
  type: string;
  totalQuantity: number;
  availableQuantity: number;
  isAvailable: boolean;
}

export const equipmentsService = new EquipmentsService();
