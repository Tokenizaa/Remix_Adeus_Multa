import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Tag,
  Gift,
  Share2,
  Percent,
  Coins,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Clock,
  Flame,
  Ticket,
  Users,
  Award,
} from 'lucide-react';
import { useRouter } from '../../core/router/RouterContext';
import { CommercialOverviewMetrics } from '../../types/commercial';

export const AdminCommercialOverviewView: React.FC = () => {
  const { navigate } = useRouter();
  const [metrics, setMetrics] = useState<CommercialOverviewMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/commercial/overview');
      const data = await res.json();
      setMetrics(data.metrics);
    } catch (err) {
      console.error('Failed to load commercial overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const commercialNavCards = [
    {
      title: 'Tabela de Preços',
      description: 'Gerencie preços padrão, promocionais e histórico de alterações por serviço.',
      icon: DollarSign,
      path: '/admin/commercial/prices',
      color: 'from-orange-500/20 to-amber-500/10',
      border: 'border-orange-500/30',
      badge: '5 Serviços Ativos',
    },
    {
      title: 'Promoções & Campanhas',
      description: 'Crie campanhas sazonais, descontos percentuais e condições de primeira compra.',
      icon: Flame,
      path: '/admin/commercial/promotions',
      color: 'from-rose-500/20 to-red-500/10',
      border: 'border-rose-500/30',
      badge: `${metrics?.activePromotionsCount || 3} Campanhas Ativas`,
    },
    {
      title: 'Gestão de Cupons',
      description: 'Administre códigos promocionais, limites de uso, validade e regras de serviço.',
      icon: Ticket,
      path: '/admin/commercial/coupons',
      color: 'from-amber-500/20 to-yellow-500/10',
      border: 'border-amber-500/30',
      badge: `${metrics?.activeCouponsCount || 4} Cupons`,
    },
    {
      title: 'Sistema de Bônus (Ledger)',
      description: 'Controle de créditos promocionais, bônus de boas-vindas e histórico imutável.',
      icon: Gift,
      path: '/admin/commercial/bonuses',
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      badge: `R$ ${(metrics?.totalActiveBonuses || 0).toFixed(2)} em Bônus`,
    },
    {
      title: 'Indicações em 3 Níveis',
      description: 'Árvore de referral determinística, taxas configuráveis e perfil dos indicadores.',
      icon: Share2,
      path: '/admin/commercial/referrals',
      color: 'from-blue-500/20 to-cyan-500/10',
      border: 'border-blue-500/30',
      badge: 'N1 10% • N2 5% • N3 2%',
    },
    {
      title: 'Ledger de Comissões',
      description: 'Acompanhe comissões pendentes, disponíveis, liquidadas e reversões por estorno.',
      icon: Coins,
      path: '/admin/commercial/commissions',
      color: 'from-violet-500/20 to-purple-500/10',
      border: 'border-violet-500/30',
      badge: `R$ ${(metrics?.totalCommissionsGenerated || 0).toFixed(2)} Geradas`,
    },
    {
      title: 'Test Center Comercial',
      description: 'Suíte automatizada com 15 casos de teste para precificação, cupom e referrals.',
      icon: Award,
      path: '/admin/commercial/tests',
      color: 'from-emerald-500/20 to-blue-500/10',
      border: 'border-emerald-500/30',
      badge: '15 Testes Automatizados',
    },
    {
      title: 'Configurações Comerciais',
      description: 'Regras de base de cálculo, prazos de liberação e governança de permissões.',
      icon: ShieldCheck,
      path: '/admin/commercial/settings',
      color: 'from-slate-700/20 to-slate-800/10',
      border: 'border-slate-700/40',
      badge: 'Governança & Permissões',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Separation Note */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/40 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono">
                Módulo Comercial & Economia
              </span>
              <span className="text-slate-500 text-xs font-mono">•</span>
              <span className="text-slate-400 text-xs">Domínio Desacoplado do Motor Jurídico</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Gestão Comercial, Preços, Bônus & Indicações
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              Administração de receita, campanhas promocionais, cupons de desconto, ledger de bônus e o programa multinível de indicação (3 níveis).
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={fetchOverview}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Atualizar Dados
            </button>
            <button
              onClick={() => navigate('/admin/commercial/tests')}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              Executar Testes
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV Volume */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Receita Bruta (GMV)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">
              R$ {(metrics?.totalRevenueGMV || 1618.2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>{metrics?.totalPaidOrders || 18} pedidos compensados</span>
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Ticket Médio</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-white font-mono">
              R$ {(metrics?.averageTicket || 89.9).toFixed(2)}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            Conversão após diagnóstico gratuito
          </div>
        </div>

        {/* Comissões Geradas */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Comissões em 3 Níveis</span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-violet-300 font-mono">
              R$ {(metrics?.totalCommissionsGenerated || 55.86).toFixed(2)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="text-emerald-400">R$ {(metrics?.totalCommissionsPaid || 0).toFixed(2)} pagas</span>
            <span>•</span>
            <span className="text-amber-400">R$ {(metrics?.totalCommissionsPending || 55.86).toFixed(2)} a pagar</span>
          </div>
        </div>

        {/* Bônus Ativos */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Bônus em Circulação</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-amber-300 font-mono">
              R$ {(metrics?.totalActiveBonuses || 60.0).toFixed(2)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>{metrics?.couponsRedeemedCount || 73} resgates de cupom</span>
          </div>
        </div>
      </div>

      {/* Commercial Modules Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span>Módulos de Administração Comercial</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {commercialNavCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.path}
                onClick={() => navigate(card.path)}
                className={`bg-slate-900/80 hover:bg-slate-850 border ${card.border} rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer group relative overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} rounded-bl-full pointer-events-none opacity-50`} />

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-white transition-colors font-mono">
                  <span>Acessar Módulo</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-orange-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
