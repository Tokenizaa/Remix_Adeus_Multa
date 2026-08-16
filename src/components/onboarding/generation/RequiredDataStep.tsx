import React from 'react';
import {
  User,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Info
} from 'lucide-react';
import { CaseDocumentData, InfractionData, VehicleData } from '../../../types';

interface RequiredDataStepProps {
  documentData: CaseDocumentData;
  infractionData: InfractionData;
  vehicleData: VehicleData;
  onUpdateDocumentData: (data: CaseDocumentData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const RequiredDataStep: React.FC<RequiredDataStepProps> = ({
  documentData,
  infractionData,
  vehicleData,
  onUpdateDocumentData,
  onNext,
  onBack,
}) => {
  const isFormValid =
    documentData.applicantName?.trim().length > 3 &&
    documentData.applicantCpf?.trim().length >= 11 &&
    documentData.applicantCnh?.trim().length >= 5 &&
    documentData.applicantEmail?.includes('@');

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-2xs space-y-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200 font-mono">
          <Sparkles className="w-3 h-3 text-orange-500" />
          Fase 2 — Qualificação para a Minuta Jurídica
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Dados do Requerente para a Petição Formal
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Essas informações são obrigatórias nos termos do art. 280 do CTB para protocolar o recurso perante a autoridade de trânsito.
        </p>
      </div>

      {/* Summary of preserved Phase 1 data */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-600">
            Dados da autuação preservados da análise gratuita:
          </span>
        </div>
        <div className="font-mono text-slate-900 font-bold flex gap-3 text-[11px]">
          <span>Placa: {vehicleData.plate || 'BRA2E19'}</span>
          <span>AIT: {infractionData.aitNumber || '1B892014'}</span>
          <span>Órgão: {infractionData.autuadorBody?.split('—')[0] || 'DETRAN'}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Row 1: Nome Completo & CPF */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="text-[10px] font-bold text-slate-700 uppercase font-mono mb-1 block">
              Nome Completo do Condutor / Requerente (como na CNH) *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-applicant-name"
                type="text"
                value={documentData.applicantName || ''}
                onChange={(e) => onUpdateDocumentData({ ...documentData, applicantName: e.target.value })}
                placeholder="Ex: Carlos Eduardo Silveira"
                className="w-full pl-8 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label className="text-[10px] font-bold text-slate-700 uppercase font-mono mb-1 block">
              CPF *
            </label>
            <input
              id="input-applicant-cpf"
              type="text"
              value={documentData.applicantCpf || ''}
              onChange={(e) => onUpdateDocumentData({ ...documentData, applicantCpf: e.target.value })}
              placeholder="000.000.000-00"
              className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none"
            />
          </div>
        </div>

        {/* Row 2: RG, CNH e Categoria */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase font-mono mb-1 block">
              RG / Órgão Emissor
            </label>
            <input
              id="input-applicant-rg"
              type="text"
              value={documentData.applicantRg || ''}
              onChange={(e) => onUpdateDocumentData({ ...documentData, applicantRg: e.target.value })}
              placeholder="Ex: 12.345.678-9 SSP/SP"
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase font-mono mb-1 block">
              Registro da CNH *
            </label>
            <input
              id="input-applicant-cnh"
              type="text"
              value={documentData.applicantCnh || ''}
              onChange={(e) => onUpdateDocumentData({ ...documentData, applicantCnh: e.target.value })}
              placeholder="Ex: 05492817492"
              className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase font-mono mb-1 block">
              Categoria CNH
            </label>
            <input
              id="input-cnh-category"
              type="text"
              value={documentData.cnhCategory || 'AB'}
              onChange={(e) => onUpdateDocumentData({ ...documentData, cnhCategory: e.target.value.toUpperCase() })}
              placeholder="Ex: B ou AB"
              className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none"
            />
          </div>
        </div>

        {/* Row 3: Contatos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase font-mono mb-1 block">
              E-mail (para receber a defesa em PDF) *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-applicant-email"
                type="email"
                value={documentData.applicantEmail || ''}
                onChange={(e) => onUpdateDocumentData({ ...documentData, applicantEmail: e.target.value })}
                placeholder="seu.email@exemplo.com"
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-700 uppercase font-mono mb-1 block">
              WhatsApp / Celular (para alertas de prazo) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-applicant-phone"
                type="tel"
                value={documentData.applicantPhone || ''}
                onChange={(e) => onUpdateDocumentData({ ...documentData, applicantPhone: e.target.value })}
                placeholder="(11) 98765-4321"
                className="w-full pl-8 pr-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Row 4: Endereço de Domicílio do Requerente */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            <h4 className="font-bold text-slate-900 text-xs font-mono uppercase">
              Endereço Residencial do Requerente (Para Qualificação no Órgão)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3">
              <label className="text-[10px] font-bold text-slate-600 font-mono block mb-1">
                Logradouro (Rua, Avenida, Alameda) *
              </label>
              <input
                id="input-address-street"
                type="text"
                value={documentData.addressStreet || ''}
                onChange={(e) => onUpdateDocumentData({ ...documentData, addressStreet: e.target.value })}
                placeholder="Ex: Rua das Flores"
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 font-mono block mb-1">
                Número *
              </label>
              <input
                id="input-address-number"
                type="text"
                value={documentData.addressNumber || ''}
                onChange={(e) => onUpdateDocumentData({ ...documentData, addressNumber: e.target.value })}
                placeholder="Ex: 450"
                className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-600 font-mono block mb-1">
                Bairro / Complemento
              </label>
              <input
                id="input-address-neighborhood"
                type="text"
                value={documentData.addressNeighborhood || ''}
                onChange={(e) => onUpdateDocumentData({ ...documentData, addressNeighborhood: e.target.value })}
                placeholder="Ex: Vila Madalena, Apto 82"
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 font-mono block mb-1">
                CEP
              </label>
              <input
                id="input-address-zipcode"
                type="text"
                value={documentData.addressZipCode || ''}
                onChange={(e) => onUpdateDocumentData({ ...documentData, addressZipCode: e.target.value })}
                placeholder="01234-567"
                className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 font-mono block mb-1">
                Cidade / UF *
              </label>
              <input
                id="input-address-citystate"
                type="text"
                value={documentData.addressCityState || ''}
                onChange={(e) => onUpdateDocumentData({ ...documentData, addressCityState: e.target.value })}
                placeholder="São Paulo/SP"
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="pt-2 flex justify-between items-center border-t border-slate-100">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao Diagnóstico</span>
        </button>

        <button
          id="btn-next-to-review"
          onClick={onNext}
          disabled={!isFormValid}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            isFormValid
              ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer shadow-xs shadow-orange-200'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Revisar Documento & Minuta</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
