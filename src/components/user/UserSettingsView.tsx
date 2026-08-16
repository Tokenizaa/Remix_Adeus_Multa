import React, { useState } from 'react';
import { Bell, Lock, ShieldCheck, CheckCircle2, Trash2, Key } from 'lucide-react';
import { useAuth } from '../../core/auth/AuthContext';

export const UserSettingsView: React.FC = () => {
  const { user } = useAuth();
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyDeadlines, setNotifyDeadlines] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordStatus('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setPasswordStatus('Senha alterada com sucesso!');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordStatus(''), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Configurações da Conta</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Gerencie suas preferências de alertas de prazos, segurança de acesso e dados pessoais.
        </p>
      </div>

      {/* Notifications Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
          <Bell className="w-4 h-4 text-orange-500" />
          <span>Alertas de Prazos & Notificações</span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <p className="font-bold text-slate-800">Alertas de Vencimento de Defesa Prévia e JARI</p>
              <p className="text-[11px] text-slate-500">
                Receba lembretes automáticos 7 dias e 48 horas antes do término do prazo de protocolo.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifyDeadlines}
              onChange={(e) => setNotifyDeadlines(e.target.checked)}
              className="rounded text-orange-500 focus:ring-orange-400 w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <p className="font-bold text-slate-800">Notificações por E-mail</p>
              <p className="text-[11px] text-slate-500">
                Envio da minuta em PDF e confirmações de pagamento via e-mail.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.checked)}
              className="rounded text-orange-500 focus:ring-orange-400 w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <p className="font-bold text-slate-800">Atualizações Rápidas via WhatsApp</p>
              <p className="text-[11px] text-slate-500">
                Notificações instantâneas quando sua peça jurídica estiver diagramada.
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifyWhatsApp}
              onChange={(e) => setNotifyWhatsApp(e.target.checked)}
              className="rounded text-orange-500 focus:ring-orange-400 w-4 h-4"
            />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <form onSubmit={handlePasswordChange} className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
          <Key className="w-4 h-4 text-orange-500" />
          <span>Alterar Senha de Acesso</span>
        </div>

        {passwordStatus && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
            {passwordStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Senha Atual
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nova Senha
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Atualizar Senha
          </button>
        </div>
      </form>

      {/* LGPD & Privacy Section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-6 space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Privacidade & LGPD</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Seus dados de condutor, placas e autos de infração são armazenados com criptografia de ponta a ponta e jamais são compartilhados com terceiros.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => alert('Para exclusão total dos dados conforme o Art. 18 da LGPD, entre em contato com dpo@defesai.com.br')}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Solicitar exclusão definitiva de dados (Art. 18 LGPD)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
