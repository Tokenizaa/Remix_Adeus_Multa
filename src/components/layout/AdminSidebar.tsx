import React from 'react';
import {
  LayoutDashboard,
  Folders,
  Users,
  FileText,
  CreditCard,
  Bot,
  Cpu,
  Boxes,
  Sliders,
  Terminal,
  HeartPulse,
  Scale,
  FolderLock,
  ShieldCheck,
  LogOut,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  DollarSign,
  Tag,
  Gift,
  Share2,
  Coins,
  Award,
} from 'lucide-react';
import { useRouter } from '../../core/router/RouterContext';
import { useAuth } from '../../core/auth/AuthContext';

export const AdminSidebar: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const { user, logout } = useAuth();

  const adminNavGroups = [
    {
      groupTitle: 'Operação Jurídica',
      items: [
        {
          label: 'Dashboard Geral',
          path: '/admin',
          icon: LayoutDashboard,
          exact: true,
        },
        {
          label: 'Casos & Autuações',
          path: '/admin/cases',
          icon: Folders,
        },
        {
          label: 'Usuários & Contas',
          path: '/admin/users',
          icon: Users,
        },
        {
          label: 'Documentos & Petições',
          path: '/admin/documents',
          icon: FileText,
        },
        {
          label: 'Pagamentos (PagBank)',
          path: '/admin/payments',
          icon: CreditCard,
        },
      ],
    },
    {
      groupTitle: 'Gestão Comercial',
      items: [
        {
          label: 'Visão Geral Comercial',
          path: '/admin/commercial',
          icon: DollarSign,
          exact: true,
        },
        {
          label: 'Tabela de Preços',
          path: '/admin/commercial/prices',
          icon: DollarSign,
        },
        {
          label: 'Promoções & Campanhas',
          path: '/admin/commercial/promotions',
          icon: Tag,
        },
        {
          label: 'Gestão de Cupons',
          path: '/admin/commercial/coupons',
          icon: Tag,
        },
        {
          label: 'Bônus (Ledger)',
          path: '/admin/commercial/bonuses',
          icon: Gift,
        },
        {
          label: 'Indicações em 3 Níveis',
          path: '/admin/commercial/referrals',
          icon: Share2,
        },
        {
          label: 'Ledger de Comissões',
          path: '/admin/commercial/commissions',
          icon: Coins,
        },
        {
          label: 'Test Center Comercial',
          path: '/admin/commercial/tests',
          icon: Award,
        },
        {
          label: 'Configurações Comerciais',
          path: '/admin/commercial/settings',
          icon: ShieldCheck,
        },
      ],
    },
    {
      groupTitle: 'Inteligência & Marketing',
      items: [
        {
          label: 'Marketing OS (7 Agentes)',
          path: '/admin/marketing',
          icon: Bot,
        },
        {
          label: 'IA & Gateway Providers',
          path: '/admin/ai',
          icon: Cpu,
        },
        {
          label: 'Hub de Integrações',
          path: '/admin/integrations',
          icon: Boxes,
        },
        {
          label: 'Base Jurídica & CTB',
          path: '/admin/knowledge',
          icon: Scale,
        },
      ],
    },
    {
      groupTitle: 'Governança & Sistema',
      items: [
        {
          label: 'Configurações (Settings)',
          path: '/admin/settings',
          icon: Sliders,
        },
        {
          label: 'Logs Estruturados',
          path: '/admin/logs',
          icon: Terminal,
        },
        {
          label: 'Monitoramento & Saúde',
          path: '/admin/monitoring',
          icon: HeartPulse,
        },
        {
          label: 'Auditoria & LGPD',
          path: '/admin/audit',
          icon: FolderLock,
        },
      ],
    },
  ];

  const isActive = (itemPath: string, exact?: boolean) => {
    if (exact || itemPath === '/admin') return currentPath === '/admin';
    return currentPath.startsWith(itemPath);
  };

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 border-r border-slate-900 flex flex-col shrink-0 min-h-screen">
      {/* Admin Brand Header */}
      <div className="p-4 border-b border-slate-900">
        <div
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center font-bold text-white shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform text-xs">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white tracking-tight text-base">DefesAi</span>
              <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono">
                Admin
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Console Operacional</p>
          </div>
        </div>
      </div>

      {/* Main Admin Navigation */}
      <div className="p-3 flex-1 space-y-4 overflow-y-auto">
        {adminNavGroups.map((group) => (
          <div key={group.groupTitle} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              {group.groupTitle}
            </div>

            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);

              return (
                <button
                  key={item.path}
                  id={`admin-nav-${item.path.replace('/admin', '').replace('/', '') || 'dashboard'}`}
                  onClick={() => navigate(item.path)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    active
                      ? 'bg-orange-500 text-white shadow-xs font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        ))}

        <div className="pt-2 px-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Status: Operacional</span>
            </div>
            <p className="text-slate-400 text-[10px] font-mono leading-tight">
              Motor Determinístico v1 ativo • 52 teses catalogadas.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Ver como Motorista</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Profile & Exit Footer */}
      <div className="p-3 border-t border-slate-900">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
              A
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrador'}</p>
              <p className="text-[10px] text-slate-400 truncate font-mono">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            title="Sair do Modo Admin"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
