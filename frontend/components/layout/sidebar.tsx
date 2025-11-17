'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Calendar, Users, LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Equipamentos', href: '/equipment', icon: Package },
  { name: 'Agendamentos', href: '/scheduling', icon: Calendar },
  { name: 'Usuários', href: '/users', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  return (
    <div className="flex flex-col h-screen w-64 bg-slate-900 text-white">
      <div className="flex items-center gap-3 p-6 border-b border-slate-800">
        <div className="p-2 bg-slate-700 rounded-lg">
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold">Sistema Escolar</h1>
          <p className="text-xs text-slate-400">Reserva Equipamentos</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
            <span className="text-sm font-medium">
              {profile?.full_name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.full_name}</p>
            <p className="text-xs text-slate-400 capitalize">{profile?.role}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
}
