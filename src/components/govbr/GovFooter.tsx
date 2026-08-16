import React from 'react';
import { Shield, Lock, Scale, ExternalLink, FileCheck, CheckCircle2 } from 'lucide-react';
import { useRouter } from '../../core/router/RouterContext';

export const GovFooter: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <footer id="footer" className="bg-[#071D41] text-white border-t-4 border-[#155BCB] pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-xs">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Grid de 4 Colunas do Mapa do Site */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-blue-900/60">
          {/* Coluna 1: Identidade do Serviço */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center font-extrabold text-2xl tracking-tighter text-white font-sans">
                <span>gov</span>
                <span className="text-[#155BCB]">.</span>
                <span className="text-[#168821]">br</span>
              </div>
              <span className="text-slate-300 font-bold text-sm">| DefesAi</span>
            </div>
            <p className="text-blue-100 text-[11px] leading-relaxed">
              Plataforma de inteligência jurídica para geração determinística de defesas e recursos de trânsito em conformidade com o Código de Trânsito Brasileiro (CTB) e Resoluções do CONTRAN.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-[#FFCD07] font-semibold">
              <Shield className="w-4 h-4 text-[#168821]" />
              <span>Sistema Oficial de Análise e Defesas</span>
            </div>
          </div>

          {/* Coluna 2: Serviços de Trânsito */}
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-3 text-blue-200">
              Serviços ao Condutor
            </h3>
            <ul className="space-y-2 text-[11px] text-blue-100">
              <li>
                <button onClick={() => navigate('/novo-caso')} className="hover:underline hover:text-white cursor-pointer text-left">
                  Análise Preliminar Gratuita de Multa
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/novo-caso')} className="hover:underline hover:text-white cursor-pointer text-left">
                  Defesa Prévia (Notificação de Autuação)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/novo-caso')} className="hover:underline hover:text-white cursor-pointer text-left">
                  Recurso à JARI (1ª Instância)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/novo-caso')} className="hover:underline hover:text-white cursor-pointer text-left">
                  Recurso ao CETRAN (2ª Instância)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/novo-caso')} className="hover:underline hover:text-white cursor-pointer text-left">
                  Conversão em Advertência (Art. 267 CTB)
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Legislação e Transparência */}
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-3 text-blue-200">
              Legislação & Normas
            </h3>
            <ul className="space-y-2 text-[11px] text-blue-100">
              <li>
                <a
                  href="https://www.planalto.gov.br/ccivil_03/leis/l9503compilado.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  <span>Lei nº 9.503/1997 (CTB)</span>
                  <ExternalLink className="w-3 h-3 text-blue-300" />
                </a>
              </li>
              <li>
                <span className="text-blue-200">Resoluções CONTRAN (798, 909, 918)</span>
              </li>
              <li>
                <span className="text-blue-200">Súmula 312 do STJ (Notificação Dupla)</span>
              </li>
              <li>
                <span className="text-blue-200">Tema 1.097 do STJ</span>
              </li>
              <li>
                <a
                  href="https://www.gov.br/transportes/pt-br/assuntos/transito/senatran"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1 text-slate-300"
                >
                  <span>SENATRAN — Secretaria Nacional</span>
                  <ExternalLink className="w-3 h-3 text-blue-300" />
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Acessibilidade & Privacidade LGPD */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-3 text-blue-200">
              Acessibilidade & LGPD
            </h3>
            <p className="text-[11px] text-blue-100 leading-relaxed">
              Tratamento de dados realizado estritamente segundo as diretrizes da Lei nº 13.709/2018 (LGPD), garantindo sigilo e minimização de coleta.
            </p>
            <div className="p-3 bg-[#0C326F] rounded-lg border border-blue-900 text-[11px] space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#FFCD07] font-semibold">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>Criptografia de Ponta a Ponta</span>
              </div>
              <p className="text-blue-200 text-[10px]">
                Em conformidade com o eMAG e WCAG 2.1 / 2.2 AA.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé Institucional Inferior */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-blue-200">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="font-extrabold text-lg tracking-wider text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#168821]" />
              BRASIL
            </div>
            <p>© {new Date().getFullYear()} Governo Federal • Conteúdo sob licença Creative Commons Atribuição-SemDerivações 3.0 Não Adaptada.</p>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-blue-300">
            <span>Padrão Digital GOV.BR</span>
            <span>•</span>
            <span>Versão 4.2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
