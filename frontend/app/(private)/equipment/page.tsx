'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Wrench, AlertCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Modal } from '@/components/ui/modal';
import { equipmentsService, Equipment } from '@/lib/services/equipments.service';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type EquipmentStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'AVAILABLE' as EquipmentStatus,
    description: '',
    location: '',
    quantity: 1,
  });

  useEffect(() => {
    // Verificar se o usuário tem permissão ADMIN
    if (profile && profile.role.toLowerCase() !== 'admin') {
      router.push('/dashboard');
      return;
    }

    if (profile?.role && profile.role.toLowerCase() === 'admin') {
      loadEquipment();
    }
  }, [profile, router]);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const data = await equipmentsService.list();
      setEquipment(data.filter(eq => eq.isActive));
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar equipamentos',
        description: 'Não foi possível carregar a lista de equipamentos. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '',
      type: '',
      status: 'AVAILABLE',
      description: '',
      location: '',
      quantity: 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Equipment) => {
    setModalMode('edit');
    setSelectedEquipment(item);
    setFormData({
      name: item.name,
      type: item.type,
      status: item.status,
      description: item.description || '',
      location: item.location || '',
      quantity: item.quantity,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (modalMode === 'create') {
        await equipmentsService.create({
          name: formData.name,
          type: formData.type,
          status: formData.status,
          description: formData.description || undefined,
          location: formData.location || undefined,
          quantity: Number(formData.quantity), // Converter para número
        });
      } else if (selectedEquipment) {
        await equipmentsService.update(selectedEquipment.id, {
          name: formData.name,
          type: formData.type,
          status: formData.status,
          description: formData.description || undefined,
          location: formData.location || undefined,
          quantity: Number(formData.quantity), // Converter para número
        });
      }

      await loadEquipment();
      setIsModalOpen(false);
      toast({
        title: modalMode === 'create' ? 'Equipamento criado!' : 'Equipamento atualizado!',
        description: modalMode === 'create' 
          ? 'O equipamento foi cadastrado com sucesso.' 
          : 'As alterações foram salvas com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao salvar equipamento:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar equipamento',
        description: error.message || 'Não foi possível salvar o equipamento. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja inativar este equipamento?')) {
      try {
        await equipmentsService.inactivate(id);
        await loadEquipment();
        toast({
          title: 'Equipamento inativado!',
          description: 'O equipamento foi inativado com sucesso.',
        });
      } catch (error: any) {
        console.error('Erro ao inativar equipamento:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao inativar equipamento',
          description: error.message || 'Não foi possível inativar o equipamento. Tente novamente.',
        });
      }
    }
  };

  const handleMaintenanceToggle = async (item: Equipment) => {
    try {
      if (item.status === 'MAINTENANCE') {
        // Se está em manutenção, marcar como disponível
        await equipmentsService.markAsAvailable(item.id);
        toast({
          title: 'Status atualizado!',
          description: 'O equipamento foi marcado como disponível.',
        });
      } else {
        // Se não está em manutenção, marcar como manutenção
        await equipmentsService.markAsMaintenance(item.id);
        toast({
          title: 'Status atualizado!',
          description: 'O equipamento foi marcado como em manutenção.',
        });
      }
      await loadEquipment();
    } catch (error: any) {
      console.error('Erro ao alterar status:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao alterar status',
        description: error.message || 'Não foi possível alterar o status do equipamento. Tente novamente.',
      });
    }
  };

  const filteredEquipment = equipment.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: EquipmentStatus) => {
    const variants: Record<EquipmentStatus, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
      AVAILABLE: { variant: 'success', label: 'Disponível' },
      IN_USE: { variant: 'warning', label: 'Em Uso' },
      MAINTENANCE: { variant: 'danger', label: 'Manutenção' },
    };
    const config = variants[status];
    return <StatusBadge variant={config.variant}>{config.label}</StatusBadge>;
  };

  const columns = [
    { header: 'Nome', accessor: 'name' as keyof Equipment },
    { header: 'Tipo', accessor: 'type' as keyof Equipment },
    { header: 'Quantidade', accessor: 'quantity' as keyof Equipment },
    { header: 'Status', accessor: (item: Equipment) => getStatusBadge(item.status) },
    { header: 'Localização', accessor: (item: Equipment) => item.location || '-' },
  ];

  // Mostrar mensagem de acesso negado se não for ADMIN
  if (profile && profile.role.toLowerCase() !== 'admin') {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Acesso Negado</h2>
            <p className="text-slate-600 mb-6">
              Você não tem permissão para acessar esta página.
              <br />
              Apenas administradores podem gerenciar equipamentos.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Equipamentos"
        description="Gerencie os equipamentos da escola"
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            <Plus size={18} className="sm:size-20" />
            <span className="hidden sm:inline">Novo Equipamento</span>
            <span className="sm:hidden">Novo</span>
          </button>
        }
      />

      <DataTable
        data={filteredEquipment}
        columns={columns}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Pesquisar equipamentos..."
        emptyMessage="Nenhum equipamento encontrado"
        actions={(item) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleMaintenanceToggle(item)}
              className={`p-2 rounded-lg transition-colors ${
                item.status === 'MAINTENANCE'
                  ? 'text-green-600 hover:bg-green-50'
                  : 'text-yellow-600 hover:bg-yellow-50'
              }`}
              title={item.status === 'MAINTENANCE' ? 'Marcar como disponível' : 'Marcar como manutenção'}
            >
              <Wrench size={18} />
            </button>
            <button
              onClick={() => openEditModal(item)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Inativar"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Novo Equipamento' : 'Editar Equipamento'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nome *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo *
            </label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Quantidade *
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              required
              min="1"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as EquipmentStatus })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="AVAILABLE">Disponível</option>
              <option value="IN_USE">Em Uso</option>
              <option value="MAINTENANCE">Manutenção</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Localização
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
      </Modal>
    </MainLayout>
  );
}
