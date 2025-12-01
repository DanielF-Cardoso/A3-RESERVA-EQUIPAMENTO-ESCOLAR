'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Modal } from '@/components/ui/modal';
import { usersService, User } from '@/lib/services/users.service';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'TEACHER' | 'STAFF' | 'ADMIN';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { profile } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'TEACHER' as UserRole,
    phone: '',
    password: '',
  });

  useEffect(() => {
    // Verificar se o usuário tem permissão ADMIN
    if (profile && profile.role.toLowerCase() !== 'admin') {
      router.push('/dashboard');
      return;
    }

    if (profile?.role && profile.role.toLowerCase() === 'admin') {
      loadUsers();
    }
  }, [profile, router]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersService.list();
      setUsers(data.filter(user => user.isActive));
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar usuários',
        description: 'Não foi possível carregar a lista de usuários. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      fullName: '',
      email: '',
      role: 'TEACHER',
      phone: '',
      password: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email.replace('@escola.com', ''),
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
      // A API espera o email completo, então adicionamos @escola.com se necessário
      const emailCompleto = formData.email.includes('@') 
        ? formData.email 
        : `${formData.email}@escola.com`;

      if (modalMode === 'create') {
        await usersService.create({
          fullName: formData.fullName,
          email: emailCompleto,
          password: formData.password,
          phone: formData.phone || undefined,
          role: formData.role,
        });
      } else if (modalMode === 'edit' && selectedUser) {
        await usersService.update(selectedUser.id, {
          fullName: formData.fullName,
          email: emailCompleto,
          phone: formData.phone || undefined,
          role: formData.role,
        });
      }

      await loadUsers();
      setIsModalOpen(false);
      toast({
        title: modalMode === 'create' ? 'Usuário criado!' : 'Usuário atualizado!',
        description: modalMode === 'create' 
          ? 'O usuário foi cadastrado com sucesso.' 
          : 'As alterações foram salvas com sucesso.',
      });
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar usuário',
        description: error.message || 'Não foi possível salvar o usuário. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja inativar este usuário?')) {
      try {
        await usersService.inactivate(id);
        await loadUsers();
        toast({
          title: 'Usuário inativado!',
          description: 'O usuário foi inativado com sucesso.',
        });
      } catch (error: any) {
        console.error('Erro ao inativar usuário:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao inativar usuário',
          description: error.message || 'Não foi possível inativar o usuário. Tente novamente.',
        });
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: UserRole) => {
    const variants: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info'; label: string }> = {
      TEACHER: { variant: 'info', label: 'Professor' },
      STAFF: { variant: 'warning', label: 'Secretaria' },
      ADMIN: { variant: 'danger', label: 'Coordenador' },
    };
    const config = variants[role];
    return <StatusBadge variant={config.variant}>{config.label}</StatusBadge>;
  };

  const columns = [
    { header: 'Nome', accessor: 'fullName' as keyof User },
    { header: 'Email', accessor: 'email' as keyof User },
    { header: 'Telefone', accessor: (user: User) => user.phone || '-' },
    { header: 'Cargo', accessor: (user: User) => getRoleBadge(user.role) },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Usuários"
        description="Gerencie os usuários do sistema"
        action={
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            <Plus size={18} className="sm:size-20" />
            <span className="hidden sm:inline">Novo Usuário</span>
            <span className="sm:hidden">Novo</span>
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
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
              Cargo *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="TEACHER">Professor</option>
              <option value="STAFF">Secretaria</option>
              <option value="ADMIN">Coordenador</option>
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
