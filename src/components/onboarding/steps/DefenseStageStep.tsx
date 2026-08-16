import React from 'react';
import {
  FileText,
  Scale,
  Building,
  UserCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';

export type DefenseStageOption = 'defesa_previa' | 'recurso_jari' | 'recurso_cetran' | 'conversao_advertencia';

interface DefenseStageStepProps {
  selectedStage: DefenseStageOption;
  onSelectStage: (stage: DefenseStageOption) => void;
  onBack: () => void;
}

export const DefenseStageStep: React.FC<DefenseStageStepProps> = ({
  selectedStage,
  onSelectStage,
  onBack,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-2xs space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200 font-mono">
          <Sparkles className="w-3 h-3 text-orange-500" />
          Fase 1 — Instância do Processo
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Em qual fase está sua notificação?
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          A fase define para qual autoridade de trânsito o recurso será endereçado (Autoridade de Trânsito, JARI ou CETRAN).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <button
          id="stage-option-defesa-previa"
          onClick={() => onSelectStage('defesa_previa')}
          className={`p-4 border rounded-xl text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs ${
            selectedStage === 'defesa_previa'
              ? 'border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20'
              : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-orange-500 transition-colors">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-xs">Defesa Prévia (Notificação de Autuação)</h3>
                <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                  Fase Inicial
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Recebeu a primeira notificação sem código de barras/boleto. Ideal para anular vícios formais do auto antes da penalidade.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono text-slate-600">
              Prazo mínimo 30 dias (Art. 281 CTB)
            </span>
            <span className="text-[10px] text-orange-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Selecionar <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </button>

        <button
          id="stage-option-recurso-jari"
          onClick={() => onSelectStage('recurso_jari')}
          className={`p-4 border rounded-xl text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs ${
            selectedStage === 'recurso_jari'
              ? 'border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20'
              : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-orange-500 transition-colors">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-xs">Recurso à JARI (1ª Instância)</h3>
                <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                  Penalidade
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                A Defesa Prévia foi negada ou já recebeu a Notificação de Imposição de Penalidade (com boleto de pagamento).
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono text-slate-600">
              Efeito Suspensivo (Art. 284/285 CTB)
            </span>
            <span className="text-[10px] text-orange-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Selecionar <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </button>

        <button
          id="stage-option-conversao-advertencia"
          onClick={() => onSelectStage('conversao_advertencia')}
          className={`p-4 border rounded-xl text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs ${
            selectedStage === 'conversao_advertencia'
              ? 'border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20'
              : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-orange-500 transition-colors">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-xs">Conversão em Advertência (Art. 267)</h3>
                <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                  Direito Subjetivo
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Infração leve ou média sem reincidência nos últimos 12 meses. A penalidade de multa deve ser convertida em advertência.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono text-emerald-700">
              Isenção Financeira e de Pontos
            </span>
            <span className="text-[10px] text-orange-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Selecionar <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </button>

        <button
          id="stage-option-recurso-cetran"
          onClick={() => onSelectStage('recurso_cetran')}
          className={`p-4 border rounded-xl text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs ${
            selectedStage === 'recurso_cetran'
              ? 'border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20'
              : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-orange-500 transition-colors">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-xs">Recurso ao CETRAN / CONTRANDIFE (2ª Instância)</h3>
                <span className="text-[9px] font-mono font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                  Instância Final
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Julgamento colegiado superior após decisão desfavorável da JARI.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono text-slate-600">
              Art. 288 e 289 do CTB
            </span>
            <span className="text-[10px] text-orange-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Selecionar <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </button>
      </div>

      <div className="pt-2 flex justify-start">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao tipo de infração</span>
        </button>
      </div>
    </div>
  );
};
