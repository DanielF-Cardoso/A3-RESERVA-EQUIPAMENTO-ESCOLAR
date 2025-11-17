'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Modal } from '@/components/ui/modal';
import { mockUsers } from '@/lib/mock-data';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: 'student' | 'teacher' | 'staff' | 'admin';
  phone: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'student' as UserProfile['role'],
    phone: '',
    password: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setUsers(mockUsers);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      full_name: '',
      email: '',
      role: 'student',
      phone: '',
      password: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserProfile) => {
    setModalMode('edit');
    setSelectedUser(user);
    const emailPrefix = user.email.replace(/@escola\.com$/, '');
    setFormData({
      full_name: user.full_name,
      email: emailPrefix,
      role: user.role,
      phone: user.phone || '',
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const email = formData.email.trim() + '@escola.com';
      if (modalMode === 'create') {
        const newUser: UserProfile = {
          id: String(Date.now()),
          full_name: formData.full_name,
          email,
          role: formData.role,
          phone: formData.phone || null,
        };
        setUsers(prev => [newUser, ...prev]);
      } else if (selectedUser) {
        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id 
            ? {
                ...user,
                full_name: formData.full_name,
                email,
                role: formData.role,
                phone: formData.phone || null,
              }
            : user
        ));
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Erro ao salvar usuário. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setUsers(prev => prev.filter(user => user.id !== id));
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: UserProfile['role']) => {
    const variants: Record<UserProfile['role'], { variant: 'info' | 'success' | 'warning' | 'danger'; label: string }> = {
      student: { variant: 'info', label: 'Lider de Sala' },
      teacher: { variant: 'success', label: 'Professor' },
      staff: { variant: 'warning', label: 'Secretária' },
      admin: { variant: 'danger', label: 'Coordenador' },
    };
    const config = variants[role];
    return <StatusBadge variant={config.variant}>{config.label}</StatusBadge>;
  };

  const columns = [
    { header: 'Nome', accessor: 'full_name' as keyof UserProfile },
    { header: 'Email', accessor: 'email' as keyof UserProfile },
    { header: 'Função', accessor: (user: UserProfile) => getRoleBadge(user.role) },
    { header: 'Telefone', accessor: (user: UserProfile) => user.phone || '-' },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Usuários"
        description="Gerencie os usuários do sistema"
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Plus size={20} />
            Novo Usuário
          </button>
        }
      />

      <DataTable
        data={filteredUsers}
        columns={columns}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Pesquisar usuários..."
        emptyMessage="Nenhum usuário encontrado"
        actions={(user) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditModal(user)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => handleDelete(user.id)}
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
        title={modalMode === 'create' ? 'Novo Usuário' : 'Editar Usuário'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email *
            </label>
            <div className="flex">
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value.replace(/[^a-zA-Z0-9._-]/g, '') })}
                required
                maxLength={40}
                placeholder="usuario"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                autoComplete="off"
                pattern="[a-zA-Z0-9._-]+"
              />
              <span className="px-4 py-2 border border-l-0 border-slate-300 rounded-r-lg bg-slate-100 text-slate-700 select-none">@escola.com</span>
            </div>
          </div>

          {modalMode === 'create' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Senha *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Função *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserProfile['role'] })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="student">Aluno</option>
              <option value="teacher">Professor</option>
              <option value="staff">Secretária</option>
              <option value="admin">Coordenador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
