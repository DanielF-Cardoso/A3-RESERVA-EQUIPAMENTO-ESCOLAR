'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Mail, Lock, ArrowRight, BookOpen, Pencil, Apple, Calculator } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError('Email ou senha inválidos');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 px-4 py-12 relative overflow-hidden">
      {/* Elementos decorativos*/}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Círculos de fundo */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-900/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-900/5 rounded-full blur-3xl"></div>
        
        {/* Canto superior esquerdo */}
        <div className="absolute top-20 left-10 text-slate-300 animate-float">
          <BookOpen size={48} strokeWidth={1.5} />
        </div>
        <div className="absolute top-40 left-32 text-slate-300/60 animate-float-delayed">
          <Pencil size={32} strokeWidth={1.5} />
        </div>
        
        {/* Canto superior direito */}
        <div className="absolute top-32 right-20 text-slate-300/70 animate-float-slow">
          <Calculator size={40} strokeWidth={1.5} />
        </div>
        <div className="absolute top-16 right-40 text-slate-300/50 animate-float">
          <Apple size={36} strokeWidth={1.5} />
        </div>
        
        {/* Canto inferior */}
        <div className="absolute bottom-32 left-20 text-slate-300/60 animate-float-delayed">
          <GraduationCap size={44} strokeWidth={1.5} />
        </div>
        <div className="absolute bottom-20 right-32 text-slate-300/70 animate-float-slow">
          <BookOpen size={36} strokeWidth={1.5} />
        </div>

      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-700 rounded-3xl mb-6 shadow-xl shadow-slate-900/20 transform hover:scale-105 transition-transform duration-300">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Reserva de Equipamentos</h1>
          <p className="text-slate-600">Acesse sua conta para continuar</p>
        </div>

        {/* Card principal */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/10 p-8 border border-slate-200/50 animate-in fade-in slide-in-from-bottom duration-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo de Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-600 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent focus:bg-white transition-all duration-200 text-slate-900 placeholder:text-slate-400"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Campo de Senha */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Senha
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-600 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent focus:bg-white transition-all duration-200 text-slate-900 placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top duration-300">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                {error}
              </div>
            )}

            {/* Botão de submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-3.5 rounded-xl font-semibold hover:from-slate-800 hover:to-slate-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/30 hover:shadow-xl hover:shadow-slate-900/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info adicional */}
        <div className="mt-6 text-center animate-in fade-in duration-1000 delay-300">
          <p className="text-xs text-slate-500">
            © 2025 Reserva de Equipamentos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
