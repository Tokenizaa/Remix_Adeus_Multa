import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, AlertCircle, Eye, FileText, Check, DollarSign } from 'lucide-react';
import { CaseDomain } from '../../types';
import { useRouter } from '../../core/router/RouterContext';

interface AdminCasesListViewProps {
  cases: CaseDomain[];
  onSelectCase: (c: CaseDomain) => void;
  onRefreshCases?: () => void;
}

export const AdminCasesListView: React.FC<AdminCasesListViewProps> = ({
  cases,
  onSelectCase,
  onRefreshCases,
}) => {
  const { navigate } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.infraction.plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.infraction.aitNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.infraction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.infraction.organ?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PAID') return c.payment?.status === 'paid';
    if (statusFilter === 'READY') return c.status === 'defense_ready';
    if (statusFilter === 'ANALYZED') return c.status === 'analyzed';
    return true;
  });

  const handleSimulatePayment = async (caseId: string) => {
    try {
      await fetch(`/api/payments/pix/${caseId}/simulate-pay`, {
        method: 'POST',
      });
      if (onRefreshCases) onRefreshCases();
    } catch (err) {
      console.error('Error simulating payment:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-mono">Gestão Operacional de Casos</h2>
          <p className="text-xs text-slate-400">
            Controle de diagnósticos, status de pagamento e geração de defesas do CTB.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
            Total: <strong className="text-white">{filteredCases.length}</strong> casos
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por placa, AIT, órgão ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-orange-500 font-mono"
          >
            <option value="ALL">Todos os Status</option>
            <option value="ANALYZED">Análise Concluída</option>
            <option value="PAID">Pagos (Aguardando Minuta)</option>
            <option value="READY">Defesas Prontas</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800 font-mono text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Auto / AIT</th>
                <th className="py-3 px-4">Placa</th>
                <th className="py-3 px-4">Infração</th>
                <th className="py-3 px-4">Órgão</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Pagamento</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 font-mono text-[11px] text-slate-300">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Nenhum caso encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">
                      {c.infraction.aitNumber || c.id}
                    </td>
                    <td className="py-3 px-4 text-orange-300 font-bold">
                      {c.infraction.plate || 'N/I'}
                    </td>
                    <td className="py-3 px-4 truncate max-w-xs font-sans">
                      {c.infraction.description || 'Infração de trânsito'}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {c.infraction.organ || 'DETRAN'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          c.status === 'defense_ready'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                            : c.status === 'paid'
                            ? 'bg-orange-950/60 text-orange-300 border-orange-800'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {c.payment?.status === 'paid' ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-bold text-[10px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Pago (R$ 89,90)
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSimulatePayment(c.id)}
                          className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-orange-400 rounded text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <DollarSign className="w-3 h-3" /> Simular PIX
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          onSelectCase(c);
                          navigate(`/cases/${c.id}`);
                        }}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-orange-400 rounded-lg text-xs font-sans font-bold transition-colors cursor-pointer border border-slate-800 inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Inspecionar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
