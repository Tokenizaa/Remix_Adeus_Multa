import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  Nav,
  NavItem,
  NavLink,
  Heading,
  Text,
  Badge,
  Button,
  Switch,
  FormControl,
  FormLabel,
  Icons,
  SearchSearch,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@reakit/box';
import { useDisclosure } from '@reakit/disclosure';
import { KnowledgeCategoryType } from '../../core/domain/knowledge-schema';
import { JsonExplorer } from './JsonExplorer';
import { InfractionsView } from './InfractionsView';
import { CTBView } from './CTBView';
import { ArgumentsView } from './ArgumentsView';
import { TemplatesView } from './TemplatesView';
import { ProceduresView } from './ProceduresView';
import { GraphView } from './GraphView';
import { DocumentEngineView } from './DocumentEngineView';
import { BlocksView } from './BlocksView';
import { ReportsView } from './ReportsView';

export const KnowledgeHub: React.FC = () => {
  const [activeView, setActiveView] = useState<'infractions' | 'ctb' | 'arguments' | 'templates' | 'procedures' | 'graph' | 'documentEngine' | 'blocks' | 'reports'>('infractions');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategoryType | 'all'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const { isOpen: isSearchOpen, onOpen: openSearch, onClose: closeSearch } = useDisclosure();

  const views = [
    { id: 'infractions', title: 'Infrações', icon: 'AlertTriangle', count: 0 },
    { id: 'ctb', title: 'CTB', icon: 'BookOpen', count: 0 },
    { id: 'arguments', title: 'Argumentos', icon: 'Search', count: 0 },
    { id: 'templates', title: 'Templates', icon: 'FileText', count: 0 },
    { id: 'procedures', title: 'Procedimentos', icon: 'List', count: 0 },
    { id: 'graph', title: 'Grafo de Conhecimento', icon: 'GitFork', count: 0 },
    { id: 'documentEngine', title: 'Engine de Documentos', icon: 'Cpu', count: 0 },
    { id: 'blocks', title: 'Blocos de Documento', icon: 'SquareStack', count: 0 },
    { id: 'reports', title: 'Relatórios', icon: 'BarChart3', count: 0 },
  ];

  const knowledgeCategories: KnowledgeCategoryType[] = [
    'direito_material',
    'direito_formal',
    'direito_constitucional',
    'metrologia_engenharia',
    'sinalizacao_viaria',
    'prazos_decadencia'
  ];

  const handleViewChange = (viewId: typeof views[number]['id']) => {
    setActiveView(viewId as any);
    closeSearch();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as KnowledgeCategoryType);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        hidden={!isSidebarOpen}
        className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
      >
        <div className="p-4">
          <Heading as="h2" className="mb-6 text-lg font-semibold flex items-center">
            Knowledge Hub
          </Heading>
          
          {/* Search */}
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={openSearch}
              className="w-full justify-start text-left"
            >
              <SearchSearch className="mr-2 h-4 w-4" />
              Buscar na base de conhecimento...
            </Button>
          </div>
          
          {/* Nav */}
          <Nav>
            {views.map((view) => (
              <NavItem key={view.id}>
                <NavLink
                  active={activeView === view.id}
                  onClick={() => handleViewChange(view.id)}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {view.icon && (
                    <span className="mr-3 h-4 w-4">
                      {/* Icon would be rendered here - simplified for now */}
                      {view.id === 'infractions' && '⚠️'}
                      {view.id === 'ctb' && '📖'}
                      {view.id === 'arguments' && '🔍'}
                      {view.id === 'templates' && '📄'}
                      {view.id === 'procedures' && '📋'}
                      {view.id === 'graph' && '🔗'}
                      {view.id === 'documentEngine' && '⚙️'}
                      {view.id === 'blocks' && '🧱'}
                      {view.id === 'reports' && '📊'}
                    </span>
                  )}
                  <span className="flex-1">{view.title}</span>
                  {view.count > 0 && (
                    <Badge variant="soft" className="ml-2">
                      {view.count}
                    </Badge>
                  )}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          
          {/* Filters */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <FormLabel className="text-xs font-medium mb-2">Categoria</FormLabel>
            <Select
              value={selectedCategory || 'all'}
              onChange={handleCategoryChange}
              className="w-full"
            >
              <option value="all">Todas as categorias</option>
              {knowledgeCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat
                    .replace(/_/g, ' ')
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
                  }
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Sidebar>
      
      {/* Sidebar Toggle Button (for mobile) */}
      <Button
        variant="outline"
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-20 p-2"
        aria-label="Toggle sidebar"
      >
        <Icons.Menu className="h-5 w-5" />
      </Button>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Search Modal (when opened from sidebar) */}
          {isSearchOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
                <Heading as="h3" className="mb-4 text-lg font-semibold">
                  Buscar na base de conhecimento
                </Heading>
                <FormControl>
                  <FormLabel>O que você está procurando?</FormLabel>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Digite sua busca..."
                    className="input input-bordered w-full mb-4"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={closeSearch}>
                      Cancelar
                    </Button>
                    <Button onClick={closeSearch} className="btn-primary">
                      Buscar
                    </Button>
                  </div>
                </FormControl>
              </div>
            </div>
          )}
          
          {/* Views Container */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Active View */}
            {activeView === 'infractions' && (
              <InfractionsView searchQuery={searchQuery} categoryFilter={selectedCategory} />
            )}
            {activeView === 'ctb' && (
              <CTBView searchQuery={searchQuery} categoryFilter={selectedCategory} />
            )}
            {activeView === 'arguments' && (
              <ArgumentsView searchQuery={searchQuery} categoryFilter={selectedCategory} />
            )}
            {activeView === 'templates' && (
              <TemplatesView searchQuery={searchQuery} categoryFilter={selectedCategory} />
            )}
            {activeView === 'procedures' && (
              <ProceduresView searchQuery={searchQuery} categoryFilter={selectedCategory} />
            )}
            {activeView === 'graph' && (
              <GraphView searchQuery={searchQuery} categoryFilter={selectedCategory} />
            )}
            {activeView === 'documentEngine' && (
              <DocumentEngineView searchQuery={searchQuery} categoryFilter={selectedCategory} />
            )}
            {activeView === 'blocks' && (
              <BlocksView searchQuery={searchQuery} categoryFilter={selectedCategory} />
            )}
            {activeView === 'reports' && (
              <ReportsView searchQuery={searchQuery} categoryFilter={selectedCategory} />
            )}
            
            {/* JsonExplorer (always visible in sidebar when searching) */}
            {searchQuery.trim() !== '' && (
              <div className="mt-6">
                <Heading as="h4" className="mb-2 text-sm font-medium">
                  Resultados da busca
                </Heading>
                <JsonExplorer 
                  query={searchQuery} 
                  categoryFilter={selectedCategory}
                  onResultSelect={(result) => {
                    // Navigate to appropriate view based on result type
                    if (result.type === 'infraction') {
                      handleViewChange('infractions');
                    } else if (result.type === 'ctb') {
                      handleViewChange('ctb');
                    } else if (result.type === 'argument') {
                      handleViewChange('arguments');
                    } else if (result.type === 'template') {
                      handleViewChange('templates');
                    } else if (result.type === 'procedure') {
                      handleViewChange('procedures');
                    } else if (result.type === 'graph') {
                      handleViewChange('graph');
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for select (simplified)
const Select: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}> = ({ value, onChange, className = '' }) => (
  <select
    value={value}
    onChange={onChange}
    className={`select select-bordered w-full ${className}`}
  >
    {/* Options will be passed as children */}
  </select>
);