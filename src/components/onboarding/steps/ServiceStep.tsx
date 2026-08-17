import React from 'react';
import {
  Gauge,
  Beer,
  Smartphone,
  CircleSlash2,
  Scale,
  UserCheck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Database,
  RefreshCw
} from 'lucide-react';
import { ProcedureType } from '../../../types';

interface ServiceStepProps {
  selectedService: ProcedureType;
  onSelectService: (service: ProcedureType) => void;
}

export const ServiceStep: React.FC<ServiceStepProps> = ({
  selectedService,
  onSelectService,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-2xs space-y-6">
      {/* Trust & Knowledge Base Banner */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#155BCB]" />
          <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
            Base Jurídica Verificada e Atualizada
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>390 dispositivos CTB</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>7 peças-modelo validadas</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Fontes: Planalto, DOU, STJ</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <RefreshCw className="w-3 h-3 text-[#155BCB] shrink-0" />
            <span>Atualização diária via DOU</span>
          </div>
        </div>
      </div>

      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200 font-mono">
          <Sparkles className="w-3 h-3 text-orange-500" />
          Fase 1 — Diagnóstico Jurídico 100% Gratuito
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Qual procedimento ou multa você deseja analisar?
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Selecione o tipo de autuação para aplicarmos as teses do Código de Trânsito Brasileiro e Resoluções do CONTRAN.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <button
          id="service-option-defesa-previa"
          onClick={() => onSelectService('defesa_previa')}
          className={`p-4 border rounded-xl text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs ${
            selectedService === 'defesa_previa'
              ? 'border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20'
              : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-orange-500 transition-colors">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Recurso de Multa Geral</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Defesa contra autuações de radar, celular, sinal vermelho ou estacionamento.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Análise Gratuita
            </span>
            <span className="text-[10px] text-orange-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Continuar <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </button>

        <button
          id="service-option-conversao-advertencia"
          onClick={() => onSelectService('conversao_advertencia')}
          className={`p-4 border rounded-xl text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs ${
            selectedService === 'conversao_advertencia'
              ? 'border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20'
              : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-orange-500 transition-colors">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Advertência por Escrito (0 Reais)</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Art. 267 do CTB (Lei 14.071/20). Isenção integral de pagamento e pontos para infrações leves/médias.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              100% Isenção
            </span>
            <span className="text-[10px] text-orange-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Continuar <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </button>

        <button
          id="service-option-suspensao-cnh"
          onClick={() => onSelectService('suspensao_cnh')}
          className={`p-4 border rounded-xl text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs ${
            selectedService === 'suspensao_cnh'
              ? 'border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20'
              : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-orange-500 transition-colors">
              <Beer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Suspensão da CNH / Lei Seca</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Art. 165/165-A ou acúmulo de pontos. Defesa para evitar bloqueio do direito de dirigir.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              Res. 723 CONTRAN
            </span>
            <span className="text-[10px] text-orange-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Continuar <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </button>

        <button
          id="service-option-recurso-jari"
          onClick={() => onSelectService('recurso_jari')}
          className={`p-4 border rounded-xl text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs ${
            selectedService === 'recurso_jari'
              ? 'border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20'
              : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-orange-500 transition-colors">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Recurso JARI (1ª Instância)</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Defesa Prévia indeferida ou notificação de penalidade com efeito suspensivo.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
              Efeito Suspensivo
            </span>
            <span className="text-[10px] text-orange-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Continuar <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </button>

        <button
          id="service-option-indicacao-condutor"
          onClick={() => onSelectService('indicacao_condutor')}
          className={`p-4 border rounded-xl text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs ${
            selectedService === 'indicacao_condutor'
              ? 'border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20'
              : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-orange-500 transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Indicação de Real Condutor</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Transferência correta da pontuação para o condutor que estava dirigindo o veículo.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
              Art. 257 § 7º
            </span>
            <span className="text-[10px] text-orange-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Continuar <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </button>

        <button
          id="service-option-recurso-cetran"
          onClick={() => onSelectService('recurso_cetran')}
          className={`p-4 border rounded-xl text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs ${
            selectedService === 'recurso_cetran'
              ? 'border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20'
              : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-orange-500 transition-colors">
              <CircleSlash2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Recurso CETRAN (2ª Instância)</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Última instância administrativa colegiada perante o Conselho Estadual de Trânsito.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
              Decisão Colegiada
            </span>
            <span className="text-[10px] text-orange-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Continuar <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </button>

        <button
          id="service-option-cassacao-cnh"
          onClick={() => onSelectService('cassacao_cnh')}
          className={`p-4 border rounded-xl text-left transition-all flex flex-col justify-between group cursor-pointer shadow-2xs ${
            selectedService === 'cassacao_cnh'
              ? 'border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20'
              : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-orange-500 transition-colors">
              <Ban className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Cassação da CNH (PCDD)</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Defesa contra processo de cassação do documento de habilitação por Art. 263 CTB.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold font-mono text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
              Penalidade Máxima
            </span>
            <span className="text-[10px] text-orange-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Continuar <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
