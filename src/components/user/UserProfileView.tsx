import React, { useState } from 'react';
import { User, Shield, CreditCard, Phone, MapPin, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../../core/auth/AuthContext';

export const UserProfileView: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [cpf, setCpf] = useState(user?.cpf || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [cnh, setCnh] = useState(user?.cnh || '');
  const [cityState, setCityState] = useState(user?.cityState || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      cpf,
      phone,
      cnh,
      cityState,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Meu Perfil de Condutor</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Estes dados são utilizados para preencher automaticamente o cabeçalho e qualificação das suas petições.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Perfil atualizado com sucesso! Suas futuras defesas serão geradas com estes dados.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-6 space-y-5">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{name || 'Condutor'}</h3>
            <p className="text-xs text-slate-500 font-mono">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200">
              Conta de Condutor Verificada
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nome Completo do Titular
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome como consta na CNH"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              CPF (Cadastro de Pessoa Física)
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Número de Registro da CNH
            </label>
            <div className="relative">
              <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cnh}
                onChange={(e) => setCnh(e.target.value)}
                placeholder="00000000000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Telefone / WhatsApp para Alertas
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">
              Cidade / Estado de Residência (Domicílio)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
                placeholder="Ex: São Paulo / SP"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </form>
    </div>
  );
};
