import React, { useState } from 'react';
import {
  Scale,
  Search,
  BookOpen,
  Building2,
  AlertTriangle,
  ExternalLink,
  Shield,
  FileCheck,
  Layers,
  FileText,
  Gavel,
  BookMarked,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Code2,
  FolderLock,
  Cpu,
  FolderTree,
  FileJson,
  Copy,
  Check,
  Compass,
  GitFork,
  BarChart3
} from 'lucide-react';
import { KNOWLEDGE_CATEGORIES } from '../../core/domain/knowledge-schema';
import { CTB_ARTICLES_DB } from '../../core/legal-base/ctb-articles';
import { RESOLUTIONS_DB } from '../../core/legal-base/resolutions';
import { JURISPRUDENCE_DB } from '../../core/legal-base/jurisprudence';
import { GLOSSARY_DB } from '../../core/legal-base/glossary';
import { ORGANS_DB } from '../../core/legal-base/organs';
import { PROCEDURES_CATALOG } from '../../core/procedures/procedures-catalog';
import { ARGUMENTS_CATALOG } from '../../core/arguments/arguments-catalog';
import { TEMPLATES_CATALOG } from '../../core/templates/templates-catalog';
import { EXPERT_RULES } from '../../core/rules/rule-engine';
import { DOCUMENT_BLOCKS } from '../../core/templates/document-blocks';
import { DocumentBlocksView } from './DocumentBlocksView';
import { DocumentEngineSimulator } from './DocumentEngineSimulator';
import {
  KNOWLEDGE_SOURCES,
  KNOWLEDGE_CTB,
  KNOWLEDGE_RESOLUTIONS,
  KNOWLEDGE_ORDINANCES,
  KNOWLEDGE_ARTICLES,
  KNOWLEDGE_INFRACTIONS,
  KNOWLEDGE_PROCEDURES,
  KNOWLEDGE_TEMPLATES,
  KNOWLEDGE_ARGUMENTS,
  KNOWLEDGE_GRAPH,
  KNOWLEDGE_REPORT,
  KNOWLEDGE_BLOCKS,
} from '../../knowledge/index';

type TabKey =
  | 'report'
  | 'assembly_engine'
  | 'blocks'
  | 'infractions'
  | 'services'
  | 'graph'
  | 'json_tree'
  | 'architecture'
  | 'ctb'
  | 'resolutions'
  | 'procedures'
  | 'arguments'
  | 'templates'
  | 'rules'
  | 'jurisprudence'
  | 'glossary'
  | 'organs';

export const KnowledgeBaseView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('report');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedArgumentDetail, setSelectedArgumentDetail] = useState<string | null>(null);
  const [selectedProcedureDetail, setSelectedProcedureDetail] = useState<string | null>(null);
  const [selectedInfractionDetail, setSelectedInfractionDetail] = useState<string | null>(null);
  const [selectedJsonFile, setSelectedJsonFile] = useState<string>('infractions/infractions.json');
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  const JSON_FILES_MAP: Record<
    string,
    { title: string; category: string; data: any; description: string }
  > = {
    'reports/collection-report.json': {
      title: 'Relatório Oficial de Coleta v1',
      category: 'Relatórios & Auditoria',
      data: KNOWLEDGE_REPORT,
      description: 'Métricas, fontes oficiais, inventário e pendências da primeira coleta jurídica.',
    },
    'infractions/infractions.json': {
      title: 'Infrações Prioritárias Normalizadas',
      category: 'Infrações',
      data: KNOWLEDGE_INFRACTIONS,
      description: 'Catálogo de 12 infrações com códigos SENATRAN, gravidades, medidas e teses.',
    },
    'articles/articles.json': {
      title: 'Artigos do CTB Normalizados',
      category: 'Legislação',
      data: KNOWLEDGE_ARTICLES,
      description: 'Entidades canônicas de artigos do CTB com texto, caput e infrações vinculadas.',
    },
    'procedures/procedures.json': {
      title: 'Serviços & Procedimentos Administrativos',
      category: 'Procedimentos',
      data: KNOWLEDGE_PROCEDURES,
      description: 'Defesa Prévia, JARI, CETRAN, PSDD, PCDD, Indicação e Advertência por Escrito.',
    },
    'arguments/arguments.json': {
      title: 'Catálogo de Teses e Argumentos Técnicos',
      category: 'Teses',
      data: KNOWLEDGE_ARGUMENTS,
      description: 'Parâmetros formais, critérios de uso, jurisprudência e probabilidade de êxito.',
    },
    'templates/templates.json': {
      title: 'Modelos Estruturais de Peças Jurídicas',
      category: 'Templates',
      data: KNOWLEDGE_TEMPLATES,
      description: 'Estruturas de seções e variáveis parametrizáveis para geração determinística.',
    },
    'blocks/document-blocks.json': {
      title: 'Biblioteca Canônica de Blocos (document_blocks)',
      category: 'Blocos',
      data: KNOWLEDGE_BLOCKS,
      description: '65+ blocos parametrizáveis para montagem modular de petições com variáveis {{placa}}, {{ait}}, etc.',
    },
    'relationships/knowledge-graph.json': {
      title: 'Grafo de Relacionamentos (Knowledge Graph)',
      category: 'Mapeamentos',
      data: KNOWLEDGE_GRAPH,
      description: 'Mapeamento relacional: Infração → Artigo CTB → Procedimento → Argumentos → Template.',
    },
    'sources/sources.json': {
      title: 'Registro de Fontes Oficiais',
      category: 'Fontes',
      data: KNOWLEDGE_SOURCES,
      description: 'Links oficiais governamentais, datas de coleta e assinaturas de verificação.',
    },
    'legislation/laws/ctb.json': {
      title: 'Código de Trânsito Brasileiro Estruturado',
      category: 'Legislação',
      data: KNOWLEDGE_CTB,
      description: 'Capítulos, seções e garantias constitucionais do CTB (Lei 9.503/97).',
    },
    'legislation/resolutions/contran.json': {
      title: 'Resoluções do CONTRAN',
      category: 'Legislação',
      data: KNOWLEDGE_RESOLUTIONS,
      description: 'Resoluções 798/20, 985/22 (MBFT), 432/13, 918/22, 900/22 e 973/22.',
    },
    'legislation/ordinances/senatran.json': {
      title: 'Portarias SENATRAN & SNE',
      category: 'Legislação',
      data: KNOWLEDGE_ORDINANCES,
      description: 'Tabela de enquadramento 159/17 e manuais operacionais do SNE.',
    },
  };

  const handleCopyJson = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Filtered queries
  const q = searchQuery.toLowerCase();

  const filteredInfractions = KNOWLEDGE_INFRACTIONS.filter(
    (inf) =>
      inf.code.toLowerCase().includes(q) ||
      inf.description.toLowerCase().includes(q) ||
      inf.ctb_article.toLowerCase().includes(q) ||
      inf.severity.toLowerCase().includes(q)
  );

  const filteredServices = KNOWLEDGE_PROCEDURES.filter(
    (srv) =>
      srv.name.toLowerCase().includes(q) ||
      srv.description.toLowerCase().includes(q) ||
      srv.legal_basis.toLowerCase().includes(q) ||
      srv.when_applies.toLowerCase().includes(q)
  );

  const filteredCtb = CTB_ARTICLES_DB.filter(
    (a) =>
      a.article.toLowerCase().includes(q) ||
      a.title.toLowerCase().includes(q) ||
      a.caput.toLowerCase().includes(q) ||
      a.practicalApplication.toLowerCase().includes(q)
  );

  const filteredResolutions = RESOLUTIONS_DB.filter(
    (r) =>
      r.number.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q) ||
      r.keyArticles.toLowerCase().includes(q)
  );

  const filteredProcedures = PROCEDURES_CATALOG.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.objective.toLowerCase().includes(q) ||
      p.legalBasis.toLowerCase().includes(q)
  );

  const filteredArguments = ARGUMENTS_CATALOG.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.legalBase.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q);
    const matchesCat =
      selectedCategoryFilter === 'all' || a.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredTemplates = TEMPLATES_CATALOG.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.code.toLowerCase().includes(q)
  );

  const filteredJurisprudence = JURISPRUDENCE_DB.filter(
    (j) =>
      j.citation.toLowerCase().includes(q) ||
      j.summary.toLowerCase().includes(q) ||
      j.precedentText.toLowerCase().includes(q)
  );

  const filteredGlossary = GLOSSARY_DB.filter(
    (g) =>
      g.term.toLowerCase().includes(q) ||
      (g.acronym && g.acronym.toLowerCase().includes(q)) ||
      g.definition.toLowerCase().includes(q)
  );

  const filteredOrgans = ORGANS_DB.filter(
    (o) =>
      o.name.toLowerCase().includes(q) ||
      o.abbreviation.toLowerCase().includes(q) ||
      o.sphere.toLowerCase().includes(q) ||
      (o.state && o.state.toLowerCase().includes(q))
  );

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-orange-50 border border-orange-100 flex items-center gap-1">
                <Scale className="w-3 h-3 text-orange-500" />
                Patrimônio Intelectual • DefesaAI
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Versão Canônica v2026.1 (Leis 14.071 / 14.229 / 14.599)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Base de Conhecimento & Motor de Regras
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Arquitetura determinística completa estruturada em 10 fases: Base Jurídica (CTB e CONTRAN), 9 Procedimentos Administrativos, Catálogo de Argumentos Técnicos, Templates Parametrizáveis e Motor Especialista de Regras.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900">{ARGUMENTS_CATALOG.length} Teses Técnicas</div>
              <div className="text-[11px] text-emerald-600 font-medium flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3 h-3" />
                100% IA-Independente
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Sub-Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-1.5 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          <button
            id="tab-engine"
            onClick={() => setActiveTab('assembly_engine')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
              activeTab === 'assembly_engine'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Motor de Documentos v1 (Playground)</span>
          </button>

          <button
            id="tab-blocks"
            onClick={() => setActiveTab('blocks')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
              activeTab === 'blocks'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-500" />
            <span>Biblioteca de Blocos ({DOCUMENT_BLOCKS.length})</span>
          </button>

          <button
            id="tab-report"
            onClick={() => setActiveTab('report')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
              activeTab === 'report'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-orange-400" />
            <span>1. Relatório Coleta v1</span>
          </button>

          <button
            id="tab-infractions"
            onClick={() => setActiveTab('infractions')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
              activeTab === 'infractions'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>2. 10 Infrações Prioritárias ({KNOWLEDGE_INFRACTIONS.length})</span>
          </button>

          <button
            id="tab-services"
            onClick={() => setActiveTab('services')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
              activeTab === 'services'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>3. 7 Serviços DefesaAI</span>
          </button>

          <button
            id="tab-graph"
            onClick={() => setActiveTab('graph')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
              activeTab === 'graph'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GitFork className="w-3.5 h-3.5 text-indigo-500" />
            <span>4. Grafo de Relações</span>
          </button>

          <button
            id="tab-json_tree"
            onClick={() => setActiveTab('json_tree')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
              activeTab === 'json_tree'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5 text-amber-500" />
            <span>5. Arquivos JSON (Tree)</span>
          </button>

          <button
            id="tab-architecture"
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
              activeTab === 'architecture'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-orange-400" />
            <span>6. Arquitetura</span>
          </button>

          <button
            id="tab-ctb"
            onClick={() => setActiveTab('ctb')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
              activeTab === 'ctb'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            <span>7. Código CTB ({CTB_ARTICLES_DB.length})</span>
          </button>

          <button
            id="tab-resolutions"
            onClick={() => setActiveTab('resolutions')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
              activeTab === 'resolutions'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Gavel className="w-3.5 h-3.5 text-indigo-500" />
            <span>8. Resoluções CONTRAN ({RESOLUTIONS_DB.length})</span>
          </button>

          <button
            id="tab-procedures"
            onClick={() => setActiveTab('procedures')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
              activeTab === 'procedures'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            <span>9. Procedimentos ({PROCEDURES_CATALOG.length})</span>
          </button>

          <button
            id="tab-arguments"
            onClick={() => setActiveTab('arguments')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
              activeTab === 'arguments'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-orange-500" />
            <span>10. Teses & Argumentos ({ARGUMENTS_CATALOG.length})</span>
          </button>

          <button
            id="tab-templates"
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
              activeTab === 'templates'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-purple-500" />
            <span>11. Templates ({TEMPLATES_CATALOG.length})</span>
          </button>

          <button
            id="tab-rules"
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
              activeTab === 'rules'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-rose-500" />
            <span>12. Motor de Regras ({EXPERT_RULES.length})</span>
          </button>

          <button
            id="tab-jurisprudence"
            onClick={() => setActiveTab('jurisprudence')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
              activeTab === 'jurisprudence'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-amber-500" />
            <span>13. Jurisprudência STJ</span>
          </button>

          <button
            id="tab-glossary"
            onClick={() => setActiveTab('glossary')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono ${
              activeTab === 'glossary'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-teal-500" />
            <span>14. Glossário & Órgãos</span>
          </button>
        </div>
      </div>

      {/* Global Search Bar for Active Tab */}
      {activeTab !== 'report' && activeTab !== 'architecture' && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar na base jurídica de trânsito (artigo, código MBFT, requisito, tese, fonte)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none shadow-2xs transition-all"
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: MOTOR DE DOCUMENTOS v1 (TEST PLAYGROUND) */}
      {/* ========================================================================= */}
      {activeTab === 'assembly_engine' && <DocumentEngineSimulator />}

      {/* ========================================================================= */}
      {/* TAB: BIBLIOTECA DE BLOCOS (DOCUMENT_BLOCKS) */}
      {/* ========================================================================= */}
      {activeTab === 'blocks' && <DocumentBlocksView />}

      {/* ========================================================================= */}
      {/* TAB: COLLECTION REPORT v1 */}
      {/* ========================================================================= */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Fontes Oficiais', value: KNOWLEDGE_REPORT.metrics.official_sources_verified, icon: Scale, color: 'text-blue-600' },
              { label: 'Resoluções CONTRAN', value: KNOWLEDGE_REPORT.metrics.contran_resolutions_indexed, icon: Gavel, color: 'text-indigo-600' },
              { label: 'Artigos Normalizados', value: KNOWLEDGE_REPORT.metrics.articles_normalized, icon: BookOpen, color: 'text-emerald-600' },
              { label: 'Infrações Prioritárias', value: KNOWLEDGE_REPORT.metrics.priority_infractions_cataloged, icon: AlertTriangle, color: 'text-rose-600' },
              { label: 'Serviços Suportados', value: KNOWLEDGE_REPORT.metrics.procedures_and_services_cataloged, icon: FileCheck, color: 'text-purple-600' },
              { label: 'Teses Especializadas', value: KNOWLEDGE_REPORT.metrics.specialized_arguments_modeled, icon: Shield, color: 'text-orange-600' },
            ].map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">{m.label}</span>
                    <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                  </div>
                  <div className="text-xl font-bold text-slate-900 font-mono">{m.value}</div>
                </div>
              );
            })}
          </div>

          {/* Official Sources Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-bold text-slate-900">Fontes Oficiais da Base de Conhecimento v1</h3>
              </div>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                100% Governamentais & Oficiais
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {KNOWLEDGE_SOURCES.map((src) => (
                <div key={src.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{src.name}</span>
                    <span className="text-[9px] font-mono bg-slate-200/70 text-slate-700 px-1.5 py-0.5 rounded">
                      {src.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    <strong>Órgão:</strong> {src.official_body}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px] font-mono">
                    <a
                      href={src.official_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-orange-600 hover:underline flex items-center gap-1 font-bold"
                    >
                      Acessar Fonte Oficial <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-slate-400">Coletado em {src.collection_date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pendencies & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-amber-700">
                <Clock className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider">Pendências Mapeadas</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {KNOWLEDGE_REPORT.pendencies.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                    <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-mono text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider">Próximas Etapas Recomendadas</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {KNOWLEDGE_REPORT.recommended_next_steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                    <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-900 font-mono text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: 10 PRIORITY INFRACTIONS */}
      {/* ========================================================================= */}
      {activeTab === 'infractions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInfractions.map((inf) => {
              const isSelected = selectedInfractionDetail === inf.id;
              const severityColor =
                inf.severity === 'gravissima'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : inf.severity === 'grave'
                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                  : inf.severity === 'media'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200';

              return (
                <div
                  key={inf.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200">
                        Cód. {inf.code} • {inf.ctb_article}
                      </span>
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${severityColor}`}>
                        {inf.severity} ({inf.points} pts)
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{inf.description}</h3>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 text-xs text-slate-700 space-y-1">
                      <div>
                        <strong className="text-slate-900 font-mono text-[10px] uppercase">Penalidade:</strong> {inf.penalty}
                      </div>
                      <div>
                        <strong className="text-slate-900 font-mono text-[10px] uppercase">Medidas Adm.:</strong> {inf.administrative_measures}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedInfractionDetail(isSelected ? null : inf.id)}
                      className="w-full text-xs font-bold text-orange-600 hover:text-orange-700 py-1.5 bg-orange-50/50 hover:bg-orange-50 rounded-lg border border-orange-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{isSelected ? 'Ocultar Teses e Documentos' : `Ver ${inf.possible_defenses.length} Teses Aplicáveis`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {isSelected && (
                      <div className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs space-y-3 mt-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-orange-400 font-bold block mb-1">
                            Teses de Defesa Recomendadas:
                          </span>
                          <ul className="space-y-1 text-slate-300">
                            {inf.possible_defenses.map((d, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-slate-800">
                          <span className="text-[10px] font-mono uppercase text-blue-400 font-bold block mb-1">
                            Documentos Comprobatórios:
                          </span>
                          <ul className="space-y-1 text-slate-300">
                            {inf.related_documents.map((doc, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <FileText className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
                                <span>{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: 7 SUPPORTED SERVICES */}
      {/* ========================================================================= */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((srv) => (
              <div key={srv.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                      {srv.id}
                    </span>
                    {srv.template_available && (
                      <span className="text-[9px] font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200 font-bold">
                        Template Pronto
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{srv.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{srv.description}</p>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 text-xs text-slate-700 space-y-1.5">
                    <div>
                      <strong className="text-slate-900 font-mono text-[10px] uppercase block">Prazo Legal:</strong>
                      <span className="text-orange-700 font-bold">{srv.deadline}</span>
                    </div>
                    <div>
                      <strong className="text-slate-900 font-mono text-[10px] uppercase block">Quando se Aplica:</strong>
                      <p className="text-[11px] text-slate-600 mt-0.5">{srv.when_applies}</p>
                    </div>
                    <div>
                      <strong className="text-slate-900 font-mono text-[10px] uppercase block">Base Legal:</strong>
                      <span className="font-mono text-[10px] text-slate-800">{srv.legal_basis}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <strong className="text-[10px] font-mono uppercase text-slate-600 block mb-1">
                    Documentos Exigidos ({srv.required_documents.length}):
                  </strong>
                  <ul className="space-y-1 text-[11px] text-slate-700">
                    {srv.required_documents.slice(0, 3).map((doc, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: KNOWLEDGE GRAPH RELATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'graph' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitFork className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-sm font-bold">Mapa Relacional de Conhecimento (Knowledge Graph)</h3>
                <p className="text-xs text-slate-300">
                  Fluxo determinístico: Infração &rarr; Artigo CTB &rarr; Procedimento &rarr; Argumentos &rarr; Template
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded border border-indigo-500/30">
              {KNOWLEDGE_GRAPH.length} Mapeamentos
            </span>
          </div>

          <div className="space-y-3">
            {KNOWLEDGE_GRAPH.map((node) => (
              <div key={node.infraction_id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-rose-50 text-rose-700 px-2.5 py-1 rounded border border-rose-200">
                      Infração {node.infraction_code}
                    </span>
                    <span className="font-mono text-xs text-slate-700 font-bold">
                      Artigo CTB: {node.ctb_article_number}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {node.applicable_procedures.map((proc, i) => (
                    <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{proc.procedure_name}</span>
                        <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
                          {proc.template_id}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                          Teses Vinculadas ({proc.applicable_arguments.length}):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {proc.applicable_arguments.map((arg) => (
                            <span key={arg} className="text-[10px] font-mono bg-orange-50 text-orange-800 px-2 py-0.5 rounded border border-orange-200">
                              {arg}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: JSON FILE TREE EXPLORER */}
      {/* ========================================================================= */}
      {activeTab === 'json_tree' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* File Sidebar */}
          <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                <FolderTree className="w-4 h-4 text-amber-500" />
                <span>knowledge/ (Estrutura v1)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {Object.keys(JSON_FILES_MAP).length} arquivos
              </span>
            </div>

            <div className="space-y-1">
              {Object.entries(JSON_FILES_MAP).map(([filePath, fileInfo]) => {
                const isSelected = selectedJsonFile === filePath;
                return (
                  <button
                    key={filePath}
                    onClick={() => setSelectedJsonFile(filePath)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-start gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <FileJson className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isSelected ? 'text-orange-400' : 'text-slate-400'}`} />
                    <div className="truncate">
                      <div className="font-mono text-[11px] truncate">{filePath}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {fileInfo.category}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* JSON Viewer */}
          <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            {(() => {
              const current = JSON_FILES_MAP[selectedJsonFile];
              return (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          knowledge/{selectedJsonFile}
                        </span>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {current.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{current.description}</p>
                    </div>

                    <button
                      onClick={() => handleCopyJson(current.data)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
                    >
                      {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedJson ? 'Copiado!' : 'Copiar JSON'}</span>
                    </button>
                  </div>

                  <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-[500px] scrollbar-thin">
                    <pre>{JSON.stringify(current.data, null, 2)}</pre>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: ARCHITECTURE (FASES 1 E 2) */}
      {/* ========================================================================= */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {KNOWLEDGE_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                    {cat.id.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-orange-600 font-semibold">
                    {cat.version}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                  {cat.subcategories.map((sub) => (
                    <span
                      key={sub}
                      className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200/60"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Architectural Flowchart Box */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-orange-400" />
              <h2 className="text-base font-bold tracking-tight">
                Pipeline de Execução Determinística DefesaAI (100% IA-Independente)
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              O núcleo da DefesaAI opera como um sistema especialista autônomo. A geração de qualquer peça jurídica ocorre integralmente através do cruzamento entre a Base Jurídica, a Biblioteca de Procedimentos, a Biblioteca de Argumentos e o Motor de Templates. A IA atua apenas como copiloto de redação opcional.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
              {[
                { step: '1', title: 'Entrada AIT', desc: 'Dados e datas' },
                { step: '2', title: 'Regras', desc: 'Validação vícios' },
                { step: '3', title: 'Teses', desc: 'Seleção preliminar' },
                { step: '4', title: 'Procedimento', desc: 'JARI/CETRAN/Defesa' },
                { step: '5', title: 'Template', desc: 'Blocos parametrizados' },
                { step: '6', title: 'Variáveis', desc: 'Interpolação segura' },
                { step: '7', title: 'Montagem', desc: 'Peça jurídica pronta' },
                { step: '8', title: 'IA Copilot', desc: 'Polimento opcional' },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60 text-center space-y-1"
                >
                  <div className="w-5 h-5 rounded-full bg-orange-500 text-white font-mono text-[10px] font-bold flex items-center justify-center mx-auto">
                    {item.step}
                  </div>
                  <div className="text-[11px] font-bold text-slate-100">{item.title}</div>
                  <div className="text-[9px] text-slate-400">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CTB ARTICLES (FASE 3) */}
      {/* ========================================================================= */}
      {activeTab === 'ctb' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredCtb.map((item) => (
              <div
                key={item.article}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-200">
                      {item.article}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.relatedResolutions.map((res) => (
                      <span
                        key={res}
                        className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Texto da Lei (Caput)
                    </span>
                    <p className="text-xs text-slate-800 italic bg-slate-50 p-3 rounded-lg border border-slate-200/60 mt-1 leading-relaxed">
                      "{item.caput}"
                    </p>
                  </div>

                  {item.paragraphsAndIncidents && item.paragraphsAndIncidents.length > 0 && (
                    <div className="space-y-1">
                      {item.paragraphsAndIncidents.map((p, idx) => (
                        <p key={idx} className="text-xs text-slate-700 bg-slate-50/50 p-2 rounded border border-slate-100">
                          {p}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-blue-50/40 rounded-lg border border-blue-100">
                      <span className="text-[10px] font-bold text-blue-900 uppercase font-mono block">
                        Aplicação Prática em Defesas
                      </span>
                      <p className="text-xs text-blue-950 mt-1 leading-relaxed">
                        {item.practicalApplication}
                      </p>
                    </div>

                    <div className="p-3 bg-rose-50/40 rounded-lg border border-rose-100">
                      <span className="text-[10px] font-bold text-rose-900 uppercase font-mono block">
                        Consequência Jurídica de Nulidade
                      </span>
                      <p className="text-xs text-rose-950 mt-1 leading-relaxed">
                        {item.nullityConsequence}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: RESOLUTIONS CONTRAN (FASE 3) */}
      {/* ========================================================================= */}
      {activeTab === 'resolutions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResolutions.map((res) => (
            <div
              key={res.number}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                    {res.number}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 font-bold">
                    Ano {res.year} • {res.body}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{res.subject}</h3>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 text-xs text-slate-700">
                  <strong className="text-slate-900 font-mono text-[10px] uppercase block mb-0.5">
                    Artigos Chave:
                  </strong>
                  {res.keyArticles}
                </div>
              </div>

              <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100/80 text-xs text-amber-950">
                <strong className="text-amber-900 font-mono text-[10px] uppercase block mb-0.5">
                  Impacto Prático nos Recursos:
                </strong>
                {res.impactOnDefenses}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PROCEDURES (FASE 4) */}
      {/* ========================================================================= */}
      {activeTab === 'procedures' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {filteredProcedures.map((proc) => {
              const isSelected = selectedProcedureDetail === proc.id;
              return (
                <div
                  key={proc.id}
                  onClick={() => setSelectedProcedureDetail(isSelected ? null : proc.id)}
                  className={`bg-white p-5 rounded-xl border transition-all cursor-pointer shadow-2xs space-y-3 ${
                    isSelected
                      ? 'border-orange-500 ring-2 ring-orange-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                      {proc.code}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                      {proc.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{proc.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                      {proc.objective}
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 text-[11px] text-slate-700 space-y-1">
                    <div>
                      <strong className="text-slate-900">Órgão Competente:</strong> {proc.competentBody}
                    </div>
                    <div>
                      <strong className="text-slate-900">Base Legal:</strong> {proc.legalBasis}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold text-orange-600">
                    <span>{proc.stages.length} Etapas • {proc.requiredDocuments.length} Docs Exigidos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Procedure Detail Modal / Expansion View */}
          {selectedProcedureDetail && (
            <div className="bg-white p-6 rounded-2xl border-2 border-orange-500 shadow-sm space-y-5">
              {(() => {
                const proc = PROCEDURES_CATALOG.find((p) => p.id === selectedProcedureDetail)!;
                return (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-200">
                            {proc.code}
                          </span>
                          <span className="text-xs font-mono text-slate-500 font-semibold uppercase">{proc.category}</span>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 mt-1">{proc.name}</h2>
                      </div>
                      <button
                        onClick={() => setSelectedProcedureDetail(null)}
                        className="text-xs text-slate-500 hover:text-slate-900 font-semibold px-3 py-1.5 rounded-lg bg-slate-100 cursor-pointer"
                      >
                        Fechar Detalhes
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <strong className="font-mono text-[10px] uppercase text-slate-700 block">Objetivo Jurídico:</strong>
                        <p className="text-slate-800 leading-relaxed">{proc.objective}</p>

                        <strong className="font-mono text-[10px] uppercase text-slate-700 block pt-2">Efeito Suspensivo:</strong>
                        <p className="text-slate-800 leading-relaxed">{proc.suspensiveEffectRule}</p>
                      </div>

                      <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-2">
                        <strong className="font-mono text-[10px] uppercase text-emerald-900 block">Documentos Obrigatórios:</strong>
                        <ul className="space-y-1.5">
                          {proc.requiredDocuments.map((doc, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-slate-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                              <div>
                                <span className="font-semibold">{doc.name}</span> {doc.required && <span className="text-[10px] text-rose-600 font-bold">(Obrigatório)</span>}
                                <p className="text-[11px] text-slate-600">{doc.description}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Stages Timeline */}
                    <div>
                      <h4 className="text-xs font-bold font-mono uppercase text-slate-900 mb-3">
                        Fluxo Sequencial de Etapas ({proc.stages.length} Passos)
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {proc.stages.map((stg) => (
                          <div key={stg.stepNumber} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                                {stg.stepNumber}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">
                                {stg.deadlineDays} dias
                              </span>
                            </div>
                            <div className="text-xs font-bold text-slate-900">{stg.name}</div>
                            <p className="text-[11px] text-slate-600 leading-relaxed">{stg.description}</p>
                            <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">
                              Ator: {stg.actingParty}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Checklist */}
                    <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                      <h4 className="text-xs font-bold font-mono uppercase text-amber-900 mb-2">
                        Checklist de Conferência Pré-Protocolo:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-amber-950">
                        {proc.executionChecklist.map((chk, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="rounded text-orange-500" />
                            <span>{chk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ARGUMENTS CATALOG (FASE 5) */}
      {/* ========================================================================= */}
      {activeTab === 'arguments' && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { key: 'all', label: 'Todas as Teses' },
              { key: 'preliminar', label: 'Preliminares de Nulidade' },
              { key: 'merito', label: 'Mérito & Atipicidade' },
              { key: 'formal', label: 'Vícios Formais (MBFT)' },
              { key: 'constitucional', label: 'Garantias Constitucionais' },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategoryFilter(cat.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategoryFilter === cat.key
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArguments.map((arg) => (
              <div
                key={arg.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3.5 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-200">
                      {arg.id} • {arg.code}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {arg.confidenceScore}% Êxito
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{arg.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{arg.description}</p>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 text-xs text-slate-700 space-y-1">
                    <div>
                      <strong className="text-slate-900 font-mono text-[10px] uppercase">Base Legal:</strong> {arg.legalBase}
                    </div>
                    {arg.resolutions.length > 0 && (
                      <div>
                        <strong className="text-slate-900 font-mono text-[10px] uppercase">Resoluções:</strong> {arg.resolutions.join('; ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-700">
                    <strong className="text-emerald-700 font-semibold">Quando Utilizar:</strong> {arg.whenToUse[0]}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      Impacto: {arg.impactType.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => setSelectedArgumentDetail(selectedArgumentDetail === arg.id ? null : arg.id)}
                      className="text-xs text-orange-600 hover:text-orange-700 font-bold cursor-pointer"
                    >
                      {selectedArgumentDetail === arg.id ? 'Ocultar Parágrafos' : 'Ver Texto Formatado →'}
                    </button>
                  </div>

                  {selectedArgumentDetail === arg.id && (
                    <div className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono space-y-2 mt-2">
                      {arg.formattedParagraphs.map((p, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="text-orange-400 font-bold">{p.heading}</div>
                          <div className="text-slate-300 leading-relaxed">{p.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: TEMPLATES (FASE 6) */}
      {/* ========================================================================= */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded border border-purple-200">
                  {tpl.code}
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-semibold">{tpl.version}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{tpl.name}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{tpl.description}</p>
              </div>

              <div className="space-y-2">
                <strong className="text-[10px] font-mono uppercase text-slate-700 block">
                  Estrutura de Blocos ({tpl.blocks.length} Seções Modulares):
                </strong>
                <div className="space-y-1.5">
                  {tpl.blocks.map((b) => (
                    <div
                      key={b.id}
                      className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-slate-200 text-slate-700 font-mono text-[9px] font-bold flex items-center justify-center">
                          {b.type[0].toUpperCase()}
                        </span>
                        <span className="font-semibold text-slate-800">{b.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {b.supportedVariables.length} vars
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-purple-50/40 rounded-lg border border-purple-100 text-xs space-y-1">
                <strong className="text-[10px] font-mono uppercase text-purple-900 block">
                  Regras de Preenchimento:
                </strong>
                {tpl.fillingRules.map((rule, idx) => (
                  <div key={idx} className="text-purple-950 text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-purple-600 shrink-0" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: RULE ENGINE (FASE 7) */}
      {/* ========================================================================= */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6 text-rose-400" />
              <div>
                <h3 className="text-sm font-bold">Motor Especialista de Regras Determinísticas</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Avalia o AIT contra normas imperativas do CTB, gerando diagnóstico instantâneo e selecionando teses sem depender de IA.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded">
              {EXPERT_RULES.length} Regras Ativas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXPERT_RULES.map((rule) => (
              <div
                key={rule.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded border border-rose-200">
                    {rule.id}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                    {rule.category.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{rule.name}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rule.description}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 text-xs text-slate-700 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase font-bold text-slate-500">Execução:</span>
                  <span className="text-emerald-600 font-bold font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Determinística em tempo real (&lt; 2ms)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: JURISPRUDENCE (FASE 3) */}
      {/* ========================================================================= */}
      {activeTab === 'jurisprudence' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredJurisprudence.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-mono font-bold text-xs bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded border border-amber-200">
                    {item.court} • {item.citation}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold">Precedente Vinculante</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{item.summary}</h3>
                  <p className="text-xs text-slate-800 italic bg-slate-50 p-3 rounded-lg border border-slate-200/60 mt-2 leading-relaxed">
                    "{item.precedentText}"
                  </p>
                </div>

                <div className="p-3 bg-amber-50/40 rounded-lg border border-amber-100 text-xs text-amber-950">
                  <strong className="text-amber-900 font-mono text-[10px] uppercase block mb-0.5">
                    Aplicabilidade nos Recursos:
                  </strong>
                  {item.applicability}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 9: GLOSSARY & ORGANS (FASE 3) */}
      {/* ========================================================================= */}
      {activeTab === 'glossary' && (
        <div className="space-y-6">
          {/* Glossary Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase text-slate-900 tracking-wider">
              Glossário Técnico-Jurídico de Trânsito ({filteredGlossary.length} Termos)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredGlossary.map((term) => (
                <div
                  key={term.term}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{term.term}</h4>
                    {term.acronym && (
                      <span className="font-mono text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
                        {term.acronym}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{term.definition}</p>
                  <div className="text-[10px] font-mono text-slate-500 pt-1">
                    Referência: {term.legalReference}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Organs Section */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold font-mono uppercase text-slate-900 tracking-wider">
              Órgãos Autuadores & Colegiados Recursais (JARI e CETRAN)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredOrgans.map((organ) => (
                <div
                  key={organ.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {organ.abbreviation}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {organ.sphere} {organ.state ? `• ${organ.state}` : ''}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900">{organ.name}</h4>
                  <p className="text-slate-600 text-[11px]">{organ.physicalAddress}</p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Prazo: {organ.standardDeadlineDays} dias</span>
                    <a
                      href={organ.onlinePortalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1"
                    >
                      Portal Oficial <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
