import React, { useState } from 'react';
import {
  FileText,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Car,
  Calendar
} from 'lucide-react';
import { CaseDomain } from '../../types';

interface CasesListViewProps {
  cases: CaseDomain[];
  onSelectCase: (caseItem: CaseDomain) => void;
  onNewCase: () => void;
}

export const CasesListView: React.FC<CasesListViewProps> = ({
  cases,
  onSelectCase,
  onNewCase,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredCases = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vehicle?.plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.infraction?.aitNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFinesSaved = cases.reduce((acc, c) => acc + (c.infraction?.fineAmount || 0), 0);
  const totalPointsAtRisk = cases.reduce((acc, c) => acc + (c.infraction?.points || 0), 0);

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider font-mono">
            Painel de Controle • Gestão de Recursos
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Processos & Defesas Administrativas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie todas as defesas administrativas, prazos fatais e protocolos perante os órgãos autuadores.
          </p>
        </div>

        <button
          id="new-analysis-button-list"
          onClick={onNewCase}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shadow-orange-200 transition-all uppercase tracking-tight"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Nova Análise Gratuita</span>
        </button>
      </div>

      {/* High-Density 3-Column Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Processos Monitorados</p>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">{cases.length}</div>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold font-mono">
            100% monitorados com IA
          </span>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Pontos na CNH em Defesa</p>
          <div className="text-2xl font-extrabold text-amber-600 font-mono">{totalPointsAtRisk} pts</div>
          <span className="text-[10px] text-slate-500 font-mono">Sob efeito suspensivo</span>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Economia Potencial</p>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            R$ {totalFinesSaved.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Valores em contestação</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por placa, número do auto (AIT) ou nome do motorista..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none shadow-2xs font-medium"
        />
      </div>

      {/* Cases List */}
      <div className="space-y-2.5">
        {filteredCases.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-2">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Nenhum processo encontrado</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Inicie uma nova análise enviando a foto ou PDF da notificação de autuação.
            </p>
            <button
              onClick={onNewCase}
              className="mt-3 px-4 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors shadow-xs shadow-orange-200"
            >
              Começar Agora
            </button>
          </div>
        ) : (
          filteredCases.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCase(c)}
              className="bg-white border border-slate-200 hover:border-orange-500 rounded-xl p-4 shadow-2xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-orange-500 transition-colors">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-xs group-hover:text-orange-600 transition-colors">
                      {c.title}
                    </h3>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase font-mono">
                      Estágio {c.currentStage}/5
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Placa: <span className="font-mono font-bold text-slate-900">{c.vehicle?.plate}</span> • {c.infraction?.autuadorBody}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Prazo fatal: {c.infraction?.defenseDeadline || 'Em análise'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-xs font-mono font-bold text-slate-900 block">
                    R$ {c.infraction?.fineAmount?.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-rose-600 font-bold block">
                    {c.infraction?.points} pontos na CNH
                  </span>
                </div>

                <div className="p-1.5 rounded-md bg-slate-50 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
