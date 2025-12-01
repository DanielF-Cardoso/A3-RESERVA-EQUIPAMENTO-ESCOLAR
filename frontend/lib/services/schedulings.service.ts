import { apiClient } from './api-client';

export type SchedulingStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Scheduling {
  id: string;
  equipmentId: string;
  userId: string;
  startDate: string;
  endDate: string;
  quantity: number;
  notes: string | null;
  status: SchedulingStatus;
  isActive: boolean;
  isCompleted: boolean;
  isCancelled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchedulingRequest {
  equipmentId: string;
  startDate: string;
  endDate: string;
  quantity: number;
  notes?: string;
}

export interface UpdateSchedulingRequest {
  equipmentId?: string;
  startDate?: string;
  endDate?: string;
  quantity?: number;
  notes?: string;
}

class SchedulingsService {
  async list(filters?: { date?: string; userId?: string; equipmentId?: string }): Promise<Scheduling[]> {
    const params = new URLSearchParams();
    if (filters?.date) params.append('date', filters.date);
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.equipmentId) params.append('equipmentId', filters.equipmentId);

    const queryString = params.toString();
    const url = queryString ? `/schedulings?${queryString}` : '/schedulings';
    
    const response = await apiClient.get<{ schedulings: Scheduling[] }>(url);
    return response.schedulings;
  }

  async create(data: CreateSchedulingRequest): Promise<Scheduling> {
    const response = await apiClient.post<{ scheduling: Scheduling }>('/schedulings', data);
    return response.scheduling;
  }

  async update(id: string, data: UpdateSchedulingRequest): Promise<Scheduling> {
    const response = await apiClient.patch<{ scheduling: Scheduling }>(`/schedulings/${id}`, data);
    return response.scheduling;
  }

  async confirm(id: string): Promise<Scheduling> {
    const response = await apiClient.patch<{ scheduling: Scheduling }>(`/schedulings/${id}/confirm`);
    return response.scheduling;
  }

  async cancel(id: string): Promise<Scheduling> {
    const response = await apiClient.patch<{ scheduling: Scheduling }>(`/schedulings/${id}/cancel`);
    return response.scheduling;
  }
}

export const schedulingsService = new SchedulingsService();