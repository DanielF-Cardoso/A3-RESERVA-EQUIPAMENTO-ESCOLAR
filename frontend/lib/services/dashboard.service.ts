import { apiClient } from './api-client';

export interface DashboardStats {
  totalEquipment: number;
  availableEquipment: number;
  equipmentInUse: number;
  equipmentInMaintenance: number;
  totalSchedulings: number;
  activeSchedulings: number;
  completedSchedulings: number;
  cancelledSchedulings: number;
  totalUsers: number;
  activeUsers: number;
  usageRate: number;
}

export interface RecentScheduling {
  id: string;
  equipmentId: string;
  userId: string;
  startDate: string;
  endDate: string;
  quantity: number;
  notes: string | null;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentSchedulings: RecentScheduling[];
}

class DashboardService {
  async getStats(): Promise<DashboardData> {
    const response = await apiClient.get<DashboardData>('/dashboard/stats');
    return response;
  }
}

export const dashboardService = new DashboardService();
