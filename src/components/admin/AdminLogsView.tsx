import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  Download,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { LogDetailModal } from './LogDetailModal';

export const AdminLogsView: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs?limit=200');
      if (!res.ok) throw new Error('Falha ao carregar logs');
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err: any) {
      console.error('Error fetching logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    if (autoRefresh) {
      const interval = setInterval(fetchLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleClearLogs = async () => {
    if (!confirm('Deseja realmente limpar os logs da memória?')) return;
    try {
      await fetch('/api/logs', { method: 'DELETE' });
      fetchLogs();
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    }
  };

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `defesai-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.correlationId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.caseId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel =
      levelFilter === 'all' ? true : log.level?.toLowerCase() === levelFilter.toLowerCase();

    const matchesService =
      serviceFilter === 'all' ? true : log.service?.toLowerCase() === serviceFilter.toLowerCase();

    return matchesSearch && matchesLevel && matchesService;
  });

  const getLevelBadge = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'ERROR':
      case 'FATAL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'WARN':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'DEBUG':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'INFO':
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-orange-400" />
            <h1 className="text-lg font-bold text-white font-mono">
              Central de Logs Estruturados & Tracing
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Inspeção em tempo real com correlationId, LGPD sanitization e rastreamento de pipeline
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              autoRefresh
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{autoRefresh ? 'Live Streaming' : 'Pausado'}</span>
          </button>

          <button
            onClick={handleExportLogs}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
            title="Exportar JSON"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleClearLogs}
            className="p-2 bg-slate-800 hover:bg-rose-900/50 text-slate-300 hover:text-rose-400 rounded-xl transition-colors cursor-pointer"
            title="Limpar logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={fetchLogs}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
            title="Recarregar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por mensagem, correlationId ou caso..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-orange-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto font-mono text-xs overflow-x-auto">
          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-mono cursor-pointer"
          >
            <option value="all">Todos os Níveis</option>
            <option value="info">INFO</option>
            <option value="warn">WARN</option>
            <option value="error">ERROR</option>
            <option value="debug">DEBUG</option>
          </select>

          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-mono cursor-pointer"
          >
            <option value="all">Todos os Serviços</option>
            <option value="ai">AI Gateway (NVIDIA/9Router)</option>
            <option value="payments">Pagamentos (PagBank)</option>
            <option value="auth">Autenticação & Sessões</option>
            <option value="database">Database (Supabase)</option>
            <option value="ocr">OCR Vision</option>
            <option value="meta">Meta Graph</option>
            <option value="documents">Document Generator</option>
            <option value="system">Sistema</option>
          </select>
        </div>
      </div>

      {/* Logs Stream Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 uppercase text-[10px]">
                <th className="p-3">Data/Hora</th>
                <th className="p-3">Nível</th>
                <th className="p-3">Serviço</th>
                <th className="p-3">Mensagem</th>
                <th className="p-3">Duração</th>
                <th className="p-3">Correlation ID</th>
                <th className="p-3 text-right">Inspecionar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-orange-500 mb-2" />
                    Carregando stream de logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Nenhum log encontrado para os critérios selecionados.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => (
                  <tr
                    key={log.id || idx}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-slate-850/50 transition-colors cursor-pointer group"
                  >
                    <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getLevelBadge(
                          log.level
                        )}`}
                      >
                        {log.level}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 uppercase text-[11px]">
                      {log.service}
                    </td>
                    <td className="p-3 text-slate-200 font-medium max-w-md truncate">
                      {log.message}
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">
                      {log.durationMs !== undefined ? `${log.durationMs}ms` : '—'}
                    </td>
                    <td className="p-3 text-[10px] text-slate-500 font-mono truncate max-w-[120px]">
                      {log.correlationId || '—'}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(log);
                        }}
                        className="p-1 bg-slate-800 group-hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                        title="Ver JSON completo"
                      >
                        <Eye className="w-3.5 h-3.5 text-orange-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </div>
  );
};
