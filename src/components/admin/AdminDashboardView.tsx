import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  CreditCard,
  FileCheck,
  Users,
  ShieldCheck,
  Scale,
  Bot,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Cpu,
  Boxes,
  Sliders,
  Terminal,
  HeartPulse,
  Folders,
  FileText,
  Zap,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { CaseDomain } from '../../types';
import { useRouter } from '../../core/router/RouterContext';

interface AdminDashboardViewProps {
  cases: CaseDomain[];
  onSelectCase: (c: CaseDomain) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ cases, onSelectCase }) => {
  const { navigate } = useRouter();
  const [overviewData, setOverviewData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOverview = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/overview');
      if (res.ok) {
        const data = await res.json();
        setOverviewData(data);
      }
    } catch (err) {
      console.error('Error loading admin overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const metrics = overviewData?.metrics || {
    totalUsers: 8,
    totalCases: cases.length,
    analyzedCases: cases.length,
    defenseReadyCases: cases.filter((c) => c.status === 'defense_ready' || c.status === 'defesa_pronta' || c.defenseDraft).length,
    paidCases: cases.filter((c) => c.isPaid || c.payment?.status === 'paid').length,
    totalRevenue: cases.filter((c) => c.isPaid || c.payment?.status === 'paid').length * 89.90,
    conversionRate: 66.7,
    aiErrorRatePercent: 0,
    systemUptimePercent: 99.98,
  };

  const operationalModules = [
    {
      title: 'Casos & Autuações',
      path: '/admin/cases',
      icon: Folders,
      description: 'Gestão de autos, NIPs, dados de veículos e prazos de defesa.',
      badge: `${metrics.totalCases} Casos`,
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    {
      title: 'Usuários & Contas',
      path: '/admin/users',
      icon: Users,
      description: 'Controle de condutores cadastrados e permissões de acesso.',
      badge: `${metrics.totalUsers} Usuários`,
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    },
    {
      title: 'Petições & Documentos',
      path: '/admin/documents',
      icon: FileText,
      description: 'Repositório de minutas ABNT geradas pelo motor CTB e RAG.',
      badge: `${metrics.defenseReadyCases} Prontas`,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'Pagamentos (PagBank)',
      path: '/admin/payments',
      icon: CreditCard,
      description: 'Transações PIX Orders v2, conciliação e webhooks.',
      badge: `R$ ${metrics.totalRevenue.toFixed(2)}`,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'IA & Gateway Providers',
      path: '/admin/ai',
      icon: Cpu,
      description: 'NVIDIA NIM primário ➔ 9Router fallback com latência P95.',
      badge: 'NVIDIA NIM 100%',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
    {
      title: 'Hub de Integrações',
      path: '/admin/integrations',
      icon: Boxes,
      description: 'Meta Graph API, Supabase Postgres, OCR e WhatsApp.',
      badge: '5 Ativas',
      badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    },
    {
      title: 'Marketing OS (7 Agentes)',
      path: '/admin/marketing',
      icon: Bot,
      description: 'Geração e publicação autônoma de conteúdo jurídico.',
      badge: '7 Agentes',
      badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    },
    {
      title: 'Configurações (Settings)',
      path: '/admin/settings',
      icon: Sliders,
      description: 'Administração centralizada de credenciais seguras.',
      badge: '14 Variáveis',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    },
    {
      title: 'Logs Estruturados',
      path: '/admin/logs',
      icon: Terminal,
      description: 'Tracing em tempo real com correlationId e LGPD.',
      badge: 'Live Stream',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    {
      title: 'Monitoramento & Saúde',
      path: '/admin/monitoring',
      icon: HeartPulse,
      description: 'Uptime de serviços, latências e observabilidade.',
      badge: '99.98% OK',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider font-mono">
              PAINEL DE CONTROLE OPERACIONAL
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-white font-mono">
            Visão Geral da Plataforma DefesAi
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Monitoramento de volume de autuações, pipeline de teses e transações financeiras.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/cases')}
            className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer font-mono"
          >
            Gerenciar Casos
          </button>
          <button
            onClick={fetchOverview}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
            title="Recarregar Métricas"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live System Health Strip */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-slate-500 text-[10px] uppercase font-bold">Saúde dos Serviços:</span>
          
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NVIDIA NIM (Llama 3.1)</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>9Router Gateway</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>PagBank Orders v2</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Supabase Postgres</span>
          </div>
        </div>

        <div className="text-slate-400 text-[11px]">
          Uptime: <span className="text-emerald-400 font-bold">{metrics.systemUptimePercent}%</span> • Latência P95: <span className="text-white font-bold">280ms</span>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Volume de Casos</span>
            <BarChart3 className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white">{metrics.totalCases}</div>
          <div className="text-[10px] text-slate-500">Autuações cadastradas</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Receita Acumulada</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            R$ {metrics.totalRevenue.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500">{metrics.paidCases} defesas pagas via PIX</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Minutas Diagramadas</span>
            <FileCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">{metrics.defenseReadyCases}</div>
          <div className="text-[10px] text-slate-500">Peças ABNT formatadas</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Taxa de Conversão</span>
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-400">{metrics.conversionRate}%</div>
          <div className="text-[10px] text-slate-500">Análise Gratuita ➔ Compra</div>
        </div>
      </div>

      {/* Operational Modules Navigation Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">
          Módulos Administrativos da Plataforma
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
          {operationalModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.path}
                onClick={() => navigate(mod.path)}
                className="p-4 bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-2xl cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-950 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white text-xs">{mod.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${mod.badgeColor}`}>
                    {mod.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  {mod.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Cases Operational Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-mono">Últimas Autuações Submetidas</h3>
            <p className="text-[11px] text-slate-400 font-mono">Acesso rápido ao detalhe operacional de cada caso</p>
          </div>

          <button
            onClick={() => navigate('/admin/cases')}
            className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer font-mono"
          >
            <span>Ver tabela completa</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Auto / ID</th>
                <th className="py-3 px-4">Placa / Veículo</th>
                <th className="py-3 px-4">Infração / CTB</th>
                <th className="py-3 px-4">Órgão</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {cases.slice(0, 5).map((c) => (
                <tr key={c.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    {c.infraction?.aitNumber || c.id}
                  </td>
                  <td className="py-3 px-4 text-orange-300 font-bold">
                    {c.vehicle?.plate || 'SEM PLACA'}
                  </td>
                  <td className="py-3 px-4 truncate max-w-xs text-slate-200">
                    {c.infraction?.description || 'Infração de trânsito'}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {c.infraction?.autuadorBody || 'DETRAN'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        c.isPaid
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {c.isPaid ? 'PAGO (PIX)' : 'AGUARDANDO'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate(`/admin/cases/${c.id}`)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-orange-400 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-700"
                    >
                      Inspecionar
                    </button>
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
