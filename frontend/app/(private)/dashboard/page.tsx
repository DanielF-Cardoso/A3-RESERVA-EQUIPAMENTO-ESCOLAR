'use client';

import { useEffect, useState } from 'react';
import { Package, Calendar, Users, TrendingUp } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { mockEquipment, mockScheduling, mockUsers } from '@/lib/mock-data';

interface DashboardStats {
  totalEquipment: number;
  availableEquipment: number;
  totalSchedulings: number;
  activeSchedulings: number;
  totalUsers: number;
}

interface RecentScheduling {
  id: string;
  start_date: string;
  equipment: { name: string };
  user: { full_name: string };
  status: 'scheduled' | 'completed' | 'cancelled';
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEquipment: 0,
    availableEquipment: 0,
    totalSchedulings: 0,
    activeSchedulings: 0,
    totalUsers: 0,
  });
  const [recentSchedulings, setRecentSchedulings] = useState<RecentScheduling[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const total = mockEquipment.length;
    const available = mockEquipment.filter((e) => e.status === 'available').length;
    
    const totalSchedulings = mockScheduling.length;
    const activeSchedulings = mockScheduling.filter((s) => s.status === 'scheduled').length;
    
    const totalUsers = mockUsers.length;

    setStats({
      totalEquipment: total,
      availableEquipment: available,
      totalSchedulings,
      activeSchedulings,
      totalUsers,
    });

    const recentSchedulingsData = mockScheduling
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map((s) => ({
        id: s.id,
        start_date: s.start_date,
        status: s.status as 'scheduled' | 'completed' | 'cancelled',
        equipment: { name: mockEquipment.find(e => e.id === s.equipment_id)?.name || 'N/A' },
        user: { full_name: mockUsers.find(u => u.id === s.user_id)?.full_name || 'N/A' },
      }));
    
    setRecentSchedulings(recentSchedulingsData);
  };

  const getStatusBadge = (status: 'scheduled' | 'completed' | 'cancelled') => {
    const variants = {
      scheduled: { variant: 'warning' as const, label: 'Agendado' },
      completed: { variant: 'success' as const, label: 'Concluído' },
      cancelled: { variant: 'danger' as const, label: 'Cancelado' },
    };
    const config = variants[status];
    return <StatusBadge variant={config.variant}>{config.label}</StatusBadge>;
  };

  return (
    <MainLayout>
      <PageHeader
        title="Dashboard"
        description="Visão geral do sistema escolar"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Equipamentos"
          value={stats.totalEquipment}
          icon={Package}
          iconColor="text-blue-600"
          trend={{
            value: `${stats.availableEquipment} disponíveis`,
            isPositive: true,
          }}
        />
        <StatCard
          title="Agendamentos Ativos"
          value={stats.activeSchedulings}
          icon={Calendar}
          iconColor="text-green-600"
          trend={{
            value: `${stats.totalSchedulings} total`,
            isPositive: true,
          }}
        />
        <StatCard
          title="Usuários Cadastrados"
          value={stats.totalUsers}
          icon={Users}
          iconColor="text-purple-600"
        />
        <StatCard
          title="Taxa de Uso"
          value={`${stats.totalEquipment > 0 ? Math.round(((stats.totalEquipment - stats.availableEquipment) / stats.totalEquipment) * 100) : 0}%`}
          icon={TrendingUp}
          iconColor="text-orange-600"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Agendamentos Recentes</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {recentSchedulings.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              Nenhum agendamento recente
            </div>
          ) : (
            recentSchedulings.map((scheduling) => (
              <div key={scheduling.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-slate-900">
                        {scheduling.equipment.name}
                      </h3>
                      {getStatusBadge(scheduling.status)}
                    </div>
                    <p className="text-sm text-slate-600">
                      Usuário: {scheduling.user.full_name}
                    </p>
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    {new Date(scheduling.start_date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
