import React from 'react';
import { GovAccessibilityBar } from '../govbr/GovAccessibilityBar';
import { GovHeader } from '../govbr/GovHeader';
import { GovFooter } from '../govbr/GovFooter';
import { GovCookieBanner } from '../govbr/GovCookieBanner';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col font-sans text-[#1B1B1B]">
      {/* 1. Barra Superior de Acessibilidade GOV.BR (eMAG / Alt + 1-4) */}
      <GovAccessibilityBar />

      {/* 2. Cabeçalho Oficial GOV.BR */}
      <GovHeader />

      {/* 3. Conteúdo Principal Acessível */}
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>

      {/* 4. Rodapé Padrão GOV.BR */}
      <GovFooter />

      {/* 5. Banner de Cookies e Privacidade LGPD */}
      <GovCookieBanner />
    </div>
  );
};
