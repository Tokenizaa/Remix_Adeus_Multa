import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { X, ShieldCheck } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  pageTitle,
  pageSubtitle,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* Top Private Security Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>DefesAi Enterprise LegalTech Core</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Ambiente Seguro e Criptografado</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[10px]">
          <span className="text-emerald-400 font-bold">API v20.0 • 99.98% Uptime</span>
          <span className="text-slate-600">•</span>
          <span>Regulamentação CTB / CONTRAN</span>
        </div>
      </div>

      <div className="flex-1 flex min-w-0">
        {/* Desktop Admin Sidebar */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        {/* Mobile Drawer Overlay */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="relative w-64 max-w-[80vw] bg-slate-950 h-full shadow-2xl flex flex-col z-10">
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                aria-label="Fechar menu administrativo"
              >
                <X className="w-5 h-5" />
              </button>
              <AdminSidebar />
            </div>
          </div>
        )}

        {/* Main Content Flow */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0b1120]">
          <AdminHeader
            onToggleMobileMenu={() => setMobileDrawerOpen(true)}
            pageTitle={pageTitle}
            pageSubtitle={pageSubtitle}
          />

          <main id="main-content" tabIndex={-1} className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto outline-none">
            {children}
          </main>

          {/* Admin Footer */}
          <footer className="p-4 border-t border-slate-900 bg-slate-950 text-slate-500 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
            <div>
              <span>DefesAi Plataforma Privada de Tecnologia Jurídica © {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>NVIDIA NIM AI • 9Router Gateway</span>
              <span>PagBank Orders v2</span>
              <span>LGPD Compliant</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
