'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { PageHeader } from '@/components/ui/page-header';
import { ScheduleCalendar } from '@/components/ui/schedule-calendar';
import { DayScheduleView } from '@/components/ui/day-schedule-view';
import { Modal } from '@/components/ui/modal';
import { StatusBadge } from '@/components/ui/status-badge';
import { mockScheduling, mockEquipment, mockUsers } from '@/lib/mock-data';
import { useAuth } from '@/hooks/useAuth';

interface Equipment {
  id: string;
  name: string;
  type: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  role: string;
}

interface Scheduling {
  id: string;
  equipment_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  notes: string | null;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

interface SchedulingWithDetails extends Scheduling {
  equipment: Equipment;
  user: UserProfile;
}

export default function SchedulingPage() {
  const [schedulings, setSchedulings] = useState<SchedulingWithDetails[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDayViewOpen, setIsDayViewOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedScheduling, setSelectedScheduling] = useState<SchedulingWithDetails | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();

  const [formData, setFormData] = useState({
    equipment_id: '',
    user_id: '',
    start_date: '',
    end_date: '',
    notes: '',
    status: 'scheduled' as Scheduling['status'],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const formattedSchedulings = mockScheduling.map((s) => ({
      id: s.id,
      equipment_id: s.equipment_id,
      user_id: s.user_id,
      start_date: s.start_date,
      end_date: s.end_date,
      notes: s.notes,
      status: s.status as 'scheduled' | 'completed' | 'cancelled',
      equipment: mockEquipment.find(e => e.id === s.equipment_id) || { id: '', name: '', type: '' },
      user: mockUsers.find(u => u.id === s.user_id) || { id: '', full_name: '', role: '' },
    }));
    
    setSchedulings(formattedSchedulings);
    setEquipment(mockEquipment.filter(e => e.status === 'available'));
    setUsers(mockUsers);
  };

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
      notes: '',
      status: 'scheduled',
    });
    setIsDayViewOpen(false);
    setIsModalOpen(true);
  };

  const openViewModal = (scheduling: SchedulingWithDetails) => {
    setModalMode('view');
    setSelectedScheduling(scheduling);
    setFormData({
      equipment_id: scheduling.equipment_id,
      user_id: scheduling.user_id,
      start_date: new Date(scheduling.start_date).toISOString().slice(0, 16),
      end_date: new Date(scheduling.end_date).toISOString().slice(0, 16),
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
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (modalMode === 'create') {
        const newScheduling: SchedulingWithDetails = {
          id: String(Date.now()),
          equipment_id: formData.equipment_id,
          user_id: formData.user_id,
          start_date: formData.start_date,
          end_date: formData.end_date,
          notes: formData.notes || null,
          status: formData.status,
          equipment: equipment.find(e => e.id === formData.equipment_id) || { id: '', name: '', type: '' },
          user: users.find(u => u.id === formData.user_id) || { id: '', full_name: '', role: '' },
        };
        setSchedulings(prev => [...prev, newScheduling]);
      } else if (modalMode === 'edit' && selectedScheduling) {
        setSchedulings(prev => prev.map(sched => 
          sched.id === selectedScheduling.id 
            ? {
                ...sched,
                equipment_id: formData.equipment_id,
                user_id: formData.user_id,
                start_date: formData.start_date,
                end_date: formData.end_date,
                notes: formData.notes || null,
                status: formData.status,
                equipment: equipment.find(e => e.id === formData.equipment_id) || sched.equipment,
                user: users.find(u => u.id === formData.user_id) || sched.user,
              }
            : sched
        ));
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving scheduling:', error);
      alert('Erro ao salvar agendamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (selectedScheduling && confirm('Tem certeza que deseja confirmar este agendamento?')) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setSchedulings(prev => prev.map(sched => 
        sched.id === selectedScheduling.id 
          ? { ...sched, status: 'confirmed' as const }
          : sched
      ));
      setIsModalOpen(false);
    }
  };

  const handleCancel = async () => {
    if (selectedScheduling && confirm('Tem certeza que deseja cancelar este agendamento?')) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setSchedulings(prev => prev.map(sched => 
        sched.id === selectedScheduling.id 
          ? { ...sched, status: 'cancelled' as const }
          : sched
      ));
      setIsModalOpen(false);
    }
  };

  const calendarEvents = schedulings.map((scheduling) => ({
    id: scheduling.id,
    title: scheduling.equipment.name,
    date: new Date(scheduling.start_date),
    color: scheduling.status === 'cancelled'
      ? 'bg-red-200 text-red-800'
      : scheduling.status === 'completed'
      ? 'bg-green-200 text-green-800'
      : scheduling.status === 'confirmed'
      ? 'bg-purple-200 text-purple-800'
      : 'bg-blue-200 text-blue-800',
  }));

  const getDayEvents = () => {
    if (!selectedDate) return [];
    
    return schedulings
      .filter((scheduling) => {
        const schedDate = new Date(scheduling.start_date);
        return (
          schedDate.getDate() === selectedDate.getDate() &&
          schedDate.getMonth() === selectedDate.getMonth() &&
          schedDate.getFullYear() === selectedDate.getFullYear()
        );
      })
      .map((scheduling) => ({
        id: scheduling.id,
        title: `${scheduling.equipment.name} - ${scheduling.user.full_name}`,
        startTime: new Date(scheduling.start_date).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        endTime: new Date(scheduling.end_date).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        color: scheduling.status === 'cancelled'
          ? 'bg-red-200 text-red-800'
          : scheduling.status === 'completed'
          ? 'bg-green-200 text-green-800'
          : scheduling.status === 'confirmed'
          ? 'bg-purple-200 text-purple-800'
          : 'bg-blue-200 text-blue-800',
      }));
  };

  const getStatusBadge = (status: Scheduling['status']) => {
    const variants: Record<Scheduling['status'], { variant: 'success' | 'warning' | 'danger' | 'info'; label: string }> = {
      scheduled: { variant: 'warning', label: 'Agendado' },
      confirmed: { variant: 'info', label: 'Confirmado' },
      completed: { variant: 'success', label: 'Concluído' },
      cancelled: { variant: 'danger', label: 'Cancelado' },
    };
    const config = variants[status];
    return <StatusBadge variant={config.variant}>{config.label}</StatusBadge>;
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
              <p className="text-slate-900">{selectedScheduling.equipment.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
              <p className="text-slate-900">{selectedScheduling.user.full_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Início</label>
                <p className="text-slate-900">
                  {new Date(selectedScheduling.start_date).toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fim</label>
                <p className="text-slate-900">
                  {new Date(selectedScheduling.end_date).toLocaleString('pt-BR')}
                </p>
              </div>
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
              {selectedScheduling.status === 'scheduled' && (
                <>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </>
              )}
              {selectedScheduling.status === 'confirmed' && (
                <>
                  <button
                    onClick={switchToEditMode}
                    className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
                {equipment.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Usuário *
              </label>
              <select
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="">Selecione um usuário</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.full_name} ({user.role})
                  </option>
                ))}
              </select>
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
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
            </div>

            {modalMode === 'edit' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Scheduling['status'] })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="scheduled">Agendado</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="completed">Concluído</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            )}

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
                disabled={loading}
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
