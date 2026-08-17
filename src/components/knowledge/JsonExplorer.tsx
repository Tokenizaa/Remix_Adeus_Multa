import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Select,
  Badge,
  Text,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spacer,
} from '@reakit/box';
import { knowledgeService } from '../../server/knowledge/knowledge-service';
import type { 
  KnowledgeSearchResult,
  CtbArticleModel,
  InfractionCatalogItem,
  ArgumentModel,
  DocumentTemplateModel,
  TemplateBlock,
  ProcedureModel,
} from '../../core/domain/knowledge-schema';

interface JsonExplorerProps {
  query: string;
  categoryFilter: string | null;
  onResultSelect: (result: {
    type: string;
    id: string;
    title: string;
  }) => void;
}

export const JsonExplorer: React.FC<JsonExplorerProps> = ({ 
  query, 
  categoryFilter, 
  onResultSelect 
}) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'ctb' | 'infractions' | 'arguments' | 'templates' | 'blocks' | 'procedures' | 'graph'>('all');
  
  const [searchParams] = useSearchParams(); // This might not work in a non-router context, but keeping for consistency

  useEffect(() => {
    const searchAllKnowledge = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const options: any = {
          topK: 10,
          threshold: 0.3,
          filterJurisdiction: 'BR_FEDERAL'
        };
        
        if (categoryFilter && categoryFilter !== 'all') {
          // This would need to be implemented in the service - for now we'll filter client-side
        }

        // Search across all knowledge types
        const [
          ctbResults,
          infractionsResults,
          argumentsResults,
          templatesResults,
          blocksResults,
          proceduresResults,
          graphResults
        ] = await Promise.all([
          knowledgeService.searchCtbArticles(query, options),
          knowledgeService.searchInfractions(query, options),
          knowledgeService.searchArguments(query, options),
          knowledgeService.searchTemplates(query, options),
          knowledgeService.searchBlocks(query, options),
          knowledgeService.searchProcedures(query, options),
          knowledgeService.searchGraphRelationships(query, options)
        ]);

        // Format results for display
        const formattedResults = [
          ...ctbResults.map((item: any) => ({
            type: 'ctb',
            id: item.id,
            title: `${item.article}: ${item.title}`,
            subtitle: item.description || '',
            data: item
          })),
          ...infractionsResults.map((item: any) => ({
            type: 'infraction',
            id: item.id,
            title: `${item.code}: ${item.description}`,
            subtitle: `Art. ${item.article} | ${item.points} pts | R$ ${item.fineAmount?.toFixed(2)}`,
            data: item
          })),
          ...argumentsResults.map((item: any) => ({
            type: 'argument',
            id: item.id,
            title: `${item.code}: ${item.title}`,
            subtitle: `${item.category} | Confiança: ${item.confidenceScore}%`,
            data: item
          })),
          ...templatesResults.map((item: any) => ({
            type: 'template',
            id: item.id,
            title: `${item.code}: ${item.name}`,
            subtitle: `Procedimento: ${item.procedureType} | v${item.version}`,
            data: item
          })),
          ...blocksResults.map((item: any) => ({
            type: 'block',
            id: item.id,
            title: `${item.type}: ${item.title}`,
            subtitle: `Obrigatório: ${item.isMandatory ? 'Sim' : 'Não'}`,
            data: item
          })),
          ...proceduresResults.map((item: any) => ({
            type: 'procedure',
            id: item.id,
            title: `${item.code}: ${item.name}`,
            subtitle: `${item.category} | ${item.objective || ''}`,
            data: item
          })),
          ...graphResults.map((item: any) => ({
            type: 'graph',
            id: item.id,
            title: `Grafo: ${item.infractionId} → ${item.ctbArticleId}`,
            subtitle: `Procedimento: ${item.procedureId || 'N/A'}`,
            data: item
          }))
        ];

        setResults(formattedResults);
      } catch (error) {
        console.error('Failed to search knowledge:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchAllKnowledge();
  }, [query, categoryFilter]);

  // Filter results by selected tab
  const filteredResults = selectedTab === 'all' 
    ? results 
    : results.filter((r: any) => r.type === selectedTab);

  const typeLabels: Record<string, string> = {
    ctb: 'CTB',
    infraction: 'Infração',
    argument: 'Argumento',
    template: 'Template',
    block: 'Bloco',
    procedure: 'Procedimento',
    graph: 'Grafo',
  };

  const typeColors: Record<string, string> = {
    ctb: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    infraction: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    argument: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    template: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    block: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    procedure: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    graph: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold flex items-center">
            Resultados da Busca
            {results.length > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({results.length} resultados)
              </span>
            )}
          </h3>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <div className="hidden sm:flex items-center space-x-3">
            <Text className="text-sm font-medium mb-0">Filtrar por tipo:</Text>
            <div className="flex space-x-2">
              <Button
                variant={selectedTab === 'all' ? 'outline' : 'secondary'}
                onClick={() => setSelectedTab('all')}
                className="px-3 py-1 text-xs"
              >
                Todos
              </Button>
              {[ 'ctb', 'infraction', 'argument', 'template', 'block', 'procedure', 'graph' ].map((type) => (
                <Button
                  key={type}
                  variant={selectedTab === type ? 'secondary' : 'outline'}
                  onClick={() => setSelectedTab(type)}
                  className="px-3 py-1 text-xs"
                >
                  {typeLabels[type]}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-6">
          <div className="inline-block animate-spin rounded-full border-2 border-primary b-l-primary w-8 h-8"></div>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhum resultado encontrado para "{query}"{selectedTab !== 'all' ? ` no tipo ${typeLabels[selectedTab]}` : ''}.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="w-20">Tipo</TableCell>
                  <TableCell className="w-40">Título</TableCell>
                  <TableCell className="w-20">Descrição/Subtítulo</TableCell>
                  <TableCell className="w-20">Ações</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result: any) => (
                  <TableRow key={`${result.type}-${result.id}`} onClick={() => onResultSelect(result)}>
                    <TableCell>
                      <Badge 
                        variant="soft" 
                        className={`${typeColors[result.type]} px-2 py-0.5 text-xs`}
                      >
                        {typeLabels[result.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium truncate max-w-48">{result.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate max-w-48">{result.subtitle}</TableCell>
                    <TableCell className="text-right">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M12 5a1 1 0 110 2 1 1 0 010-2zM12 19a1 1 0 110 2 1 1 0 010-2z" />
                      </svg>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};