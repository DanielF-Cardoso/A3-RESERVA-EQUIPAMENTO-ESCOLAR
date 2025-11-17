'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Wrench } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Modal } from '@/components/ui/modal';
import { mockEquipment } from '@/lib/mock-data';

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'in_use' | 'maintenance';
  description: string | null;
  location: string | null;
  quantity: number;
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'available' as Equipment['status'],
    description: '',
    location: '',
    quantity: 1,
  });

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setEquipment(mockEquipment);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '',
      type: '',
      status: 'available',
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (modalMode === 'create') {
        const newEquipment: Equipment = {
          id: String(Date.now()),
          name: formData.name,
          type: formData.type,
          status: formData.status,
          description: formData.description || null,
          location: formData.location || null,
          quantity: formData.quantity,
        };
        setEquipment(prev => [newEquipment, ...prev]);
      } else if (selectedEquipment) {
        setEquipment(prev => prev.map(item => 
          item.id === selectedEquipment.id 
            ? {
                ...item,
                name: formData.name,
                type: formData.type,
                status: formData.status,
                description: formData.description || null,
                location: formData.location || null,
                quantity: formData.quantity,
              }
            : item
        ));
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este equipamento?')) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setEquipment(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleMaintenanceToggle = async (item: Equipment) => {
    const newStatus = item.status === 'maintenance' ? 'available' : 'maintenance';
    setEquipment(prev => prev.map(eq => 
      eq.id === item.id ? { ...eq, status: newStatus } : eq
    ));
  };

  const filteredEquipment = equipment.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Equipment['status']) => {
    const variants: Record<Equipment['status'], { variant: 'success' | 'warning' | 'danger'; label: string }> = {
      available: { variant: 'success', label: 'Disponível' },
      in_use: { variant: 'warning', label: 'Em Uso' },
      maintenance: { variant: 'danger', label: 'Manutenção' },
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

  return (
    <MainLayout>
      <PageHeader
        title="Equipamentos"
        description="Gerencie os equipamentos da escola"
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Plus size={20} />
            Novo Equipamento
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
              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              title={item.status === 'maintenance' ? 'Marcar como disponível' : 'Marcar como manutenção'}
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
              title="Excluir"
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
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Equipment['status'] })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="available">Disponível</option>
              <option value="in_use">Em Uso</option>
              <option value="maintenance">Manutenção</option>
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
