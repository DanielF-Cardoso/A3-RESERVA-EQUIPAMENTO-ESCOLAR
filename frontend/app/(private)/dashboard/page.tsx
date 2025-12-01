'use client';

import { useEffect, useState, useCallback } from 'react';
import { Package, Calendar, Users, TrendingUp } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { dashboardService, DashboardStats, RecentScheduling } from '@/lib/services/dashboard.service';
import { equipmentsService, Equipment } from '@/lib/services/equipments.service';
import { usersService, User } from '@/lib/services/users.service';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';

interface EnrichedScheduling extends RecentScheduling {
  equipment?: Equipment;
  user?: User;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSchedulings, setRecentSchedulings] = useState<EnrichedScheduling[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuthContext();
  const { toast } = useToast();

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Buscar estatísticas do dashboard
      const dashboardData = await dashboardService.getStats();
      setStats(dashboardData.stats);

      // Buscar equipamentos e usuários para enriquecer os agendamentos recentes
      const [equipments, users] = await Promise.all([
        equipmentsService.list(),
        usersService.list(),
      ]);

      // Enriquecer agendamentos recentes com dados de equipamento e usuário
      const enrichedSchedulings = dashboardData.recentSchedulings.map(scheduling => ({
        ...scheduling,
        equipment: equipments.find(e => e.id === scheduling.equipmentId),
        user: users.find(u => u.id === scheduling.userId),
      }));

      setRecentSchedulings(enrichedSchedulings);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar dashboard',
        description: 'Não foi possível carregar os dados do dashboard. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // Proteção: apenas ADMIN pode acessar dashboard
    if (profile) {
      const role = profile.role?.toLowerCase();
      if (role !== 'admin') {
        // Usuários não-admin não devem ver o dashboard
        return;
      }
      loadDashboardData();
    }
  }, [profile, loadDashboardData]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info'; label: string }> = {
      SCHEDULED: { variant: 'warning', label: 'Agendado' },
      CONFIRMED: { variant: 'info', label: 'Confirmado' },
      COMPLETED: { variant: 'success', label: 'Concluído' },
      CANCELLED: { variant: 'danger', label: 'Cancelado' },
    };
    const config = variants[status] || { variant: 'warning' as const, label: status };
    return <StatusBadge variant={config.variant}>{config.label}</StatusBadge>;
  };

  if (loading || !stats) {
    return (
      <MainLayout>
        <PageHeader
          title="Dashboard"
          description="Visão geral do sistema escolar"
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-slate-600">Carregando...</div>
        </div>
      </MainLayout>
    );
  }

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
          value={stats.activeUsers}
          icon={Users}
          iconColor="text-purple-600"
          trend={{
            value: `${stats.totalUsers} total`,
            isPositive: true,
          }}
        />
        <StatCard
          title="Taxa de Uso"
          value={`${stats.usageRate}%`}
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
                        {scheduling.equipment?.name || 'Equipamento N/A'}
                      </h3>
                      {getStatusBadge(scheduling.status)}
                    </div>
                    <p className="text-sm text-slate-600">
                      Usuário: {scheduling.user?.fullName || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    {new Date(scheduling.startDate).toLocaleDateString('pt-BR', {
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
