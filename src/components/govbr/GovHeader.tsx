import React, { useState } from 'react';
import {
  Menu,
  X,
  Search,
  LogIn,
  User,
  Shield,
  FileText,
  HelpCircle,
  Scale,
  LogOut,
  LayoutDashboard,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useRouter } from '../../core/router/RouterContext';
import { useAuth } from '../../core/auth/AuthContext';

export const GovHeader: React.FC = () => {
  const { navigate, currentPath } = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/novo-caso');
    }
  };

  return (
    <header className="w-full bg-white border-b border-[#CCCCCC] relative z-40">
      {/* 1. Barra Institucional Brasil */}
      <div className="bg-[#071D41] text-white py-1 px-4 sm:px-6 lg:px-8 text-[11px] border-b border-[#0C326F]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold tracking-wider text-xs flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#168821] inline-block" />
              BRASIL
            </span>
            <span className="hidden sm:inline text-blue-200 text-[10px]">
              Governo Federal
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-blue-100">
            <a
              href="https://www.gov.br/pt-br/orgaos-do-governo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hidden md:inline"
            >
              Órgãos do Governo
            </a>
            <a
              href="https://www.gov.br/acessoainformacao/pt-br"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hidden sm:inline"
            >
              Acesso à Informação
            </a>
            <a
              href="https://www4.planalto.gov.br/legislacao"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Legislação
            </a>
          </div>
        </div>
      </div>

      {/* 2. Cabeçalho Principal do Sistema (Logo gov.br + Nome do Serviço + Busca + Login GOV.BR) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Lado Esquerdo: Menu Hambúrguer + Logo GOV.BR + Título */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 -ml-2 rounded-lg text-[#071D41] hover:bg-slate-100 focus:ring-2 focus:ring-[#155BCB] cursor-pointer"
              aria-label="Abrir menu de navegação"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo Oficial GOV.BR */}
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className="flex items-center font-extrabold text-2xl tracking-tighter text-[#071D41] font-sans">
                <span>gov</span>
                <span className="text-[#155BCB]">.</span>
                <span className="text-[#168821]">br</span>
              </div>

              <div className="h-6 w-px bg-slate-300 hidden sm:block" />

              <div>
                <h1 className="text-sm sm:text-base font-bold text-[#071D41] tracking-tight flex items-center gap-1.5">
                  <span>DefesAi</span>
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 bg-blue-50 text-[#155BCB] border border-blue-200 rounded">
                    SNT • CTB
                  </span>
                </h1>
                <p className="text-[11px] text-slate-600 hidden md:block">
                  Defesas e Recursos de Trânsito do Brasil
                </p>
              </div>
            </div>
          </div>

          {/* Lado Direito: Busca Global (Alt + 3) + Botão Oficial "Entrar com GOV.BR" */}
          <div className="flex items-center gap-3">
            {/* Campo de Busca GOV.BR */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative w-64">
              <input
                id="main-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar serviços ou infrações..."
                className="w-full bg-[#F8F8F8] border border-[#CCCCCC] rounded-full py-1.5 pl-3.5 pr-8 text-xs text-slate-800 placeholder-slate-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#155BCB]"
              />
              <button
                type="submit"
                className="absolute right-2.5 text-slate-500 hover:text-[#155BCB] cursor-pointer"
                aria-label="Executar busca"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Ação Primária: Iniciar Diagnóstico Gratuito */}
            <button
              onClick={() => navigate('/novo-caso')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-[#155BCB] hover:bg-[#0C326F] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFCD07]" />
              <span>Análise Gratuita</span>
            </button>

            {/* Botão Oficial GOV.BR / Usuário Autenticado */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}
                  className="px-3 py-1.5 bg-[#071D41] hover:bg-[#0C326F] text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#FFCD07]" />
                  <span className="max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                </button>

                <button
                  onClick={() => logout()}
                  className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg cursor-pointer"
                  title="Sair da conta"
                  aria-label="Sair da conta"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="btn-entrar-govbr"
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-[#071D41] hover:bg-[#0C326F] text-white rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs border border-[#0C326F]"
              >
                <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[#071D41] font-extrabold text-[9px]">
                  g
                </div>
                <span>Entrar com gov.br</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Menu Retrátil Lateral (Off-canvas / Drawer GOV.BR - Alt + 2) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          <nav
            id="main-menu"
            className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto"
            aria-label="Navegação Principal do Sistema"
          >
            {/* Topo do Menu */}
            <div className="p-4 bg-[#071D41] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-white">gov.br</span>
                <span className="text-xs text-blue-200">| DefesAi</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-lg text-white hover:bg-[#0C326F] cursor-pointer"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links do Menu */}
            <div className="p-4 space-y-6 flex-1 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block px-2 mb-1">
                  Navegação Principal
                </span>
                <button
                  onClick={() => {
                    navigate('/');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 font-semibold text-slate-800 flex items-center justify-between"
                >
                  <span>Página Inicial</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    navigate('/novo-caso');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg bg-blue-50 text-[#155BCB] font-bold flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Nova Análise de Multa (Gratuita)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#155BCB]" />
                </button>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block px-2 mb-1">
                  Área do Cidadão
                </span>
                <button
                  onClick={() => {
                    navigate('/dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 text-slate-800 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                    Painel de Recursos
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    navigate('/cases');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 text-slate-800 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    Meus Processos
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {isAdmin && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 font-mono block px-2 mb-1">
                    Administração Pública
                  </span>
                  <button
                    onClick={() => {
                      navigate('/admin');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg bg-purple-50 text-purple-900 font-bold flex items-center justify-between"
                  >
                    <span>Console Administrativo</span>
                    <ChevronRight className="w-3.5 h-3.5 text-purple-700" />
                  </button>
                  <button
                    onClick={() => {
                      navigate('/admin/knowledge');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-purple-50 text-purple-800 flex items-center justify-between"
                  >
                    <span>Base Canônica (52 Teses CTB)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-purple-700" />
                  </button>
                </div>
              )}
            </div>

            {/* Rodapé do Menu */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
              <p className="font-semibold text-slate-800 mb-1">Central de Atendimento</p>
              <p>Segunda a sexta, das 8h às 18h</p>
              <p className="mt-2 text-[10px] font-mono">DefesAi • Em conformidade com o CTB</p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
