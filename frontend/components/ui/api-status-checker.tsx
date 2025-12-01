'use client';

import { useState } from 'react';
import { Activity, CheckCircle, XCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555';

export function ApiStatusChecker() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'online' | 'offline'>('idle');

  const checkApi = async () => {
    setStatus('checking');
    try {
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
      });
      
      if (response.ok) {
        setStatus('online');
      } else {
        setStatus('offline');
      }
    } catch (error) {
      setStatus('offline');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={checkApi}
        disabled={status === 'checking'}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all ${
          status === 'online'
            ? 'bg-green-100 text-green-700 border border-green-300'
            : status === 'offline'
            ? 'bg-red-100 text-red-700 border border-red-300'
            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
        }`}
      >
        {status === 'checking' && (
          <>
            <Activity size={16} className="animate-spin" />
            <span className="text-sm font-medium">Verificando...</span>
          </>
        )}
        {status === 'online' && (
          <>
            <CheckCircle size={16} />
            <span className="text-sm font-medium">API Online</span>
          </>
        )}
        {status === 'offline' && (
          <>
            <XCircle size={16} />
            <span className="text-sm font-medium">API Offline</span>
          </>
        )}
        {status === 'idle' && (
          <>
            <Activity size={16} />
            <span className="text-sm font-medium">Testar API</span>
          </>
        )}
      </button>
      {status === 'offline' && (
        <div className="mt-2 p-3 bg-white rounded-lg shadow-lg border border-slate-200 text-xs text-slate-600 max-w-xs">
          <p className="font-semibold mb-1">Backend não está rodando</p>
          <p>Inicie o backend com:</p>
          <code className="block mt-1 p-2 bg-slate-100 rounded text-slate-800">
            cd backend && npm run start:dev
          </code>
        </div>
      )}
    </div>
  );
}
