import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Search, History, CheckCircle2 } from 'lucide-react';
import { AuditLogEntry } from '../../types';

export const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch('/api/audit-logs');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error('Error fetching logs:', err);
      }
    }
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(filter.toLowerCase()) ||
      l.actor.toLowerCase().includes(filter.toLowerCase()) ||
      l.details.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-5">
      <div>
        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider font-mono flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
          Conformidade & Governança • LGPD
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
          Auditoria de Segurança & Trilha Imutável
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Trilha de eventos append-only com mascaramento criptográfico de dados sensíveis e auditoria de agentes.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase font-mono">
            Registros Auditados ({filteredLogs.length})
          </span>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar eventos..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 outline-none focus:ring-1 focus:ring-orange-500 font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 font-mono text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Data / Hora</th>
                <th className="py-2.5 px-3">Agente / Ator</th>
                <th className="py-2.5 px-3">Ação Realizada</th>
                <th className="py-2.5 px-3">Recurso Alvo</th>
                <th className="py-2.5 px-3">IP Hash</th>
                <th className="py-2.5 px-3">LGPD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 text-slate-500">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">{log.actor}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-sans">{log.targetResource}</td>
                  <td className="py-2.5 px-3 text-slate-400 text-[10px] truncate max-w-[120px]">{log.ipHash}</td>
                  <td className="py-2.5 px-3">
                    <span className="flex items-center gap-1 text-emerald-700 font-sans font-bold text-[10px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Conforme
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
