'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { PageHeader } from '@/components/ui/page-header';
import { ScheduleCalendar } from '@/components/ui/schedule-calendar';
import { DayScheduleView } from '@/components/ui/day-schedule-view';
import { Modal } from '@/components/ui/modal';
import { StatusBadge } from '@/components/ui/status-badge';
import { useAuthContext } from '@/hooks/useAuthContext';
import { schedulingsService, Scheduling, SchedulingStatus } from '@/lib/services/schedulings.service';
import { equipmentsService, Equipment, EquipmentAvailability } from '@/lib/services/equipments.service';
import { usersService, User } from '@/lib/services/users.service';
import { useToast } from '@/hooks/use-toast';

interface SchedulingWithDetails extends Scheduling {
  equipment?: Equipment;
  user?: User;
}

export default function SchedulingPage() {
  const [schedulings, setSchedulings] = useState<SchedulingWithDetails[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [availableEquipment, setAvailableEquipment] = useState<EquipmentAvailability[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDayViewOpen, setIsDayViewOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedScheduling, setSelectedScheduling] = useState<SchedulingWithDetails | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const { profile } = useAuthContext();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    equipment_id: '',
    user_id: '',
    start_date: '',
    end_date: '',
    quantity: 1,
    notes: '',
    status: 'SCHEDULED' as SchedulingStatus,
  });

  useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar agendamentos
      const schedulingsData = await schedulingsService.list();
      
      // Carregar equipamentos e usuários em paralelo
      const [equipmentData, usersData] = await Promise.all([
        equipmentsService.list(),
        usersService.list(),
      ]);

      // Enriquecer agendamentos com dados de equipamento e usuário
      const enrichedSchedulings = schedulingsData.map(scheduling => ({
        ...scheduling,
        equipment: equipmentData.find(e => e.id === scheduling.equipmentId),
        user: usersData.find(u => u.id === scheduling.userId),
      }));

      setSchedulings(enrichedSchedulings);
      setEquipment(equipmentData.filter(e => e.isActive && e.status === 'AVAILABLE'));
      setUsers(usersData.filter(u => u.isActive));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar os agendamentos. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableEquipment = async (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return;
    
    try {
      const availability = await equipmentsService.checkAvailability(startDate, endDate);
      setAvailableEquipment(availability);
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      // Fallback: mostrar todos os equipamentos ativos
      setAvailableEquipment([]);
    }
  };

  // Atualizar disponibilidade quando as datas mudarem
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      loadAvailableEquipment(formData.start_date, formData.end_date);
    }
  }, [formData.start_date, formData.end_date]);

  const openDayView = (date: Date) => {
    setSelectedDate(date);
    setIsDayViewOpen(true);
  };

  const openCreateModal = (date: Date, hour?: number) => {
    setModalMode('create');
    setSelectedDate(date);
    const dateStr = date.toISOString().split('T')[0];
    const startHour = hour !== undefined ? hour : 8;
    const endHour = startHour + 1;
    setFormData({
      equipment_id: '',
      user_id: profile?.id || '',
      start_date: `${dateStr}T${startHour.toString().padStart(2, '0')}:00`,
      end_date: `${dateStr}T${endHour.toString().padStart(2, '0')}:00`,
      quantity: 1,
      notes: '',
      status: 'SCHEDULED',
    });
    setIsDayViewOpen(false);
    setIsModalOpen(true);
  };

  const openViewModal = (scheduling: SchedulingWithDetails) => {
    setModalMode('view');
    setSelectedScheduling(scheduling);
    setFormData({
      equipment_id: scheduling.equipmentId,
      user_id: scheduling.userId,
      start_date: new Date(scheduling.startDate).toISOString().slice(0, 16),
      end_date: new Date(scheduling.endDate).toISOString().slice(0, 16),
      quantity: scheduling.quantity,
      notes: scheduling.notes || '',
      status: scheduling.status,
    });
    setIsModalOpen(true);
  };

  const switchToEditMode = () => {
    setModalMode('edit');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar se as datas não são no passado
    const now = new Date();
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (startDate < now) {
      toast({
        variant: 'destructive',
        title: 'Data inválida',
        description: 'A data/hora de início não pode ser no passado.',
      });
      return;
    }

    if (endDate < now) {
      toast({
        variant: 'destructive',
        title: 'Data inválida',
        description: 'A data/hora de fim não pode ser no passado.',
      });
      return;
    }

    if (endDate <= startDate) {
      toast({
        variant: 'destructive',
        title: 'Data inválida',
        description: 'A data/hora de fim deve ser posterior à data/hora de início.',
      });
      return;
    }

    setLoading(true);

    try {
      if (modalMode === 'create') {
        await schedulingsService.create({
          equipmentId: formData.equipment_id,
          startDate: formData.start_date,
          endDate: formData.end_date,
          quantity: Number(formData.quantity), // Converter para número
          notes: formData.notes || undefined,
        });
      } else if (modalMode === 'edit' && selectedScheduling) {
        await schedulingsService.update(selectedScheduling.id, {
          equipmentId: formData.equipment_id,
          startDate: formData.start_date,
          endDate: formData.end_date,
          quantity: Number(formData.quantity), // Converter para número
          notes: formData.notes || undefined,
        });
      }

      await loadData();
      setIsModalOpen(false);
      toast({
        title: modalMode === 'create' ? 'Agendamento criado!' : 'Agendamento atualizado!',
        description: modalMode === 'create' 
          ? 'O agendamento foi criado com sucesso.' 
          : 'As alterações foram salvas com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao salvar agendamento:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar agendamento',
        description: error.message || 'Não foi possível salvar o agendamento. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedScheduling) return;

    // Verificar permissão
    const userRole = profile?.role.toLowerCase();
    if (userRole !== 'staff' && userRole !== 'admin') {
      toast({
        variant: 'destructive',
        title: 'Permissão negada',
        description: 'Apenas secretaria e coordenadores podem confirmar agendamentos.',
      });
      return;
    }

    if (confirm('Tem certeza que deseja confirmar este agendamento?')) {
      try {
        setLoading(true);
        await schedulingsService.confirm(selectedScheduling.id);
        await loadData();
        setIsModalOpen(false);
        toast({
          title: 'Agendamento confirmado!',
          description: 'O agendamento foi confirmado com sucesso.',
        });
      } catch (error: any) {
        console.error('Erro ao confirmar agendamento:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao confirmar agendamento',
          description: error.message || 'Não foi possível confirmar o agendamento. Tente novamente.',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = async () => {
    if (!selectedScheduling) return;

    // Verificar permissão
    const userRole = profile?.role.toLowerCase();
    if (userRole !== 'staff' && userRole !== 'admin') {
      toast({
        variant: 'destructive',
        title: 'Permissão negada',
        description: 'Apenas secretaria e coordenadores podem cancelar agendamentos.',
      });
      return;
    }

    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
      try {
        setLoading(true);
        await schedulingsService.cancel(selectedScheduling.id);
        await loadData();
        setIsModalOpen(false);
        toast({
          title: 'Agendamento cancelado!',
          description: 'O agendamento foi cancelado com sucesso.',
        });
      } catch (error: any) {
        console.error('Erro ao cancelar agendamento:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao cancelar agendamento',
          description: error.message || 'Não foi possível cancelar o agendamento. Tente novamente.',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const calendarEvents = schedulings.map((scheduling) => ({
    id: scheduling.id,
    title: scheduling.equipment?.name || 'Equipamento',
    date: new Date(scheduling.startDate),
    color: scheduling.status === 'CANCELLED'
      ? 'bg-red-200 text-red-800'
      : scheduling.status === 'COMPLETED'
      ? 'bg-green-200 text-green-800'
      : scheduling.status === 'CONFIRMED'
      ? 'bg-purple-200 text-purple-800'
      : 'bg-blue-200 text-blue-800',
  }));

  const getDayEvents = () => {
    if (!selectedDate) return [];
    
    return schedulings
      .filter((scheduling) => {
        const schedDate = new Date(scheduling.startDate);
        return (
          schedDate.getDate() === selectedDate.getDate() &&
          schedDate.getMonth() === selectedDate.getMonth() &&
          schedDate.getFullYear() === selectedDate.getFullYear()
        );
      })
      .map((scheduling) => ({
        id: scheduling.id,
        title: `${scheduling.equipment?.name || 'Equipamento'} - ${scheduling.user?.fullName || 'Usuário'}`,
        startTime: new Date(scheduling.startDate).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        endTime: new Date(scheduling.endDate).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        color: scheduling.status === 'CANCELLED'
          ? 'bg-red-200 text-red-800'
          : scheduling.status === 'COMPLETED'
          ? 'bg-green-200 text-green-800'
          : scheduling.status === 'CONFIRMED'
          ? 'bg-purple-200 text-purple-800'
          : 'bg-blue-200 text-blue-800',
      }));
  };

  const getStatusBadge = (status: SchedulingStatus) => {
    const variants: Record<SchedulingStatus, { variant: 'success' | 'warning' | 'danger' | 'info'; label: string }> = {
      SCHEDULED: { variant: 'warning', label: 'Agendado' },
      CONFIRMED: { variant: 'info', label: 'Confirmado' },
      COMPLETED: { variant: 'success', label: 'Concluído' },
      CANCELLED: { variant: 'danger', label: 'Cancelado' },
    };
    const config = variants[status];
    return <StatusBadge variant={config.variant}>{config.label}</StatusBadge>;
  };

  // Verificar se usuário pode confirmar/cancelar
  const canConfirmOrCancel = () => {
    const userRole = profile?.role.toLowerCase();
    return userRole === 'staff' || userRole === 'admin';
  };

  return (
    <MainLayout>
      <PageHeader
        title="Agendamentos"
        description="Gerencie os agendamentos de equipamentos"
      />

      <ScheduleCalendar
        events={calendarEvents}
        onDateClick={(date) => openDayView(date)}
        onEventClick={(event) => {
          const scheduling = schedulings.find((s) => s.id === event.id);
          if (scheduling) openViewModal(scheduling);
        }}
      />

      {isDayViewOpen && selectedDate && (
        <DayScheduleView
          date={selectedDate}
          events={getDayEvents()}
          onClose={() => setIsDayViewOpen(false)}
          onTimeSlotClick={(hour) => openCreateModal(selectedDate, hour)}
          onEventClick={(event) => {
            const scheduling = schedulings.find((s) => s.id === event.id);
            if (scheduling) openViewModal(scheduling);
          }}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === 'create'
            ? 'Novo Agendamento'
            : modalMode === 'view'
            ? 'Detalhes do Agendamento'
            : 'Editar Agendamento'
        }
      >
        {modalMode === 'view' && selectedScheduling ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Equipamento</label>
              <p className="text-slate-900">{selectedScheduling.equipment?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
              <p className="text-slate-900">{selectedScheduling.user?.fullName || 'N/A'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Início</label>
                <p className="text-slate-900">
                  {new Date(selectedScheduling.startDate).toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fim</label>
                <p className="text-slate-900">
                  {new Date(selectedScheduling.endDate).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quantidade</label>
              <p className="text-slate-900">{selectedScheduling.quantity}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              {getStatusBadge(selectedScheduling.status)}
            </div>
            {selectedScheduling.notes && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                <p className="text-slate-900">{selectedScheduling.notes}</p>
              </div>
            )}
            <div className="flex gap-3 pt-4">
              {selectedScheduling.status === 'SCHEDULED' && canConfirmOrCancel() && (
                <>
                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={switchToEditMode}
                    className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </>
              )}
              {selectedScheduling.status === 'CONFIRMED' && canConfirmOrCancel() && (
                <>
                  <button
                    onClick={switchToEditMode}
                    className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Equipamento *
              </label>
              <select
                value={formData.equipment_id}
                onChange={(e) => setFormData({ ...formData, equipment_id: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">Selecione um equipamento</option>
                {availableEquipment.length > 0 ? (
                  availableEquipment.map((item) => (
                    <option 
                      key={item.equipmentId} 
                      value={item.equipmentId}
                      disabled={!item.isAvailable || item.availableQuantity === 0}
                    >
                      {item.name} - {item.type} (Disponível: {item.availableQuantity}/{item.totalQuantity})
                      {!item.isAvailable && ' - INDISPONÍVEL'}
                    </option>
                  ))
                ) : (
                  equipment.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} - {item.type} (Qtd: {item.quantity})
                    </option>
                  ))
                )}
              </select>
              {formData.start_date && formData.end_date && availableEquipment.length === 0 && (
                <p className="text-xs text-slate-500 mt-1">
                  Verificando disponibilidade...
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Data/Hora Início *
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Data/Hora Fim *
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  min={formData.start_date || new Date().toISOString().slice(0, 16)}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Quantidade *
              </label>
              <input
                type="number"
                min="1"
                max={
                  formData.equipment_id && availableEquipment.length > 0
                    ? availableEquipment.find(e => e.equipmentId === formData.equipment_id)?.availableQuantity
                    : undefined
                }
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
              {formData.equipment_id && availableEquipment.length > 0 && (
                <p className="text-xs text-slate-500 mt-1">
                  Máximo disponível: {availableEquipment.find(e => e.equipmentId === formData.equipment_id)?.availableQuantity || 0} unidades
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Observações
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={
                  loading || 
                  (!!formData.equipment_id && availableEquipment.length > 0 && 
                    formData.quantity > (availableEquipment.find(e => e.equipmentId === formData.equipment_id)?.availableQuantity || 0))
                }
                className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </MainLayout>
  );
}
