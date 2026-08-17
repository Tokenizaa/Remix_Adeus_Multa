import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Caption,
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
} from '@reakit/box';
import { knowledgeService } from '../../server/knowledge/knowledge-service';
import { JsonExplorer } from './JsonExplorer';
import { useSearchParams } from 'react-router-dom';

export const ReportsView: React.FC<{ 
  searchQuery: string; 
  categoryFilter: string | null 
}> = ({ searchQuery, categoryFilter }) => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        // Use query from props or URL params
        const query = searchQuery || searchParams.get('q') || '';
        const filters: any = {};
        
        if (categoryFilter && categoryFilter !== 'all') {
          filters.category = categoryFilter;
        }
        
        if (query.trim()) {
          const results = await knowledgeService.searchInfractions(query, { // Using infractions as placeholder
            topK: 20,
            threshold: 0.3,
            filterJurisdiction: 'BR_FEDERAL'
          });
          setReports(results);
        } else {
          // In a real implementation, this would fetch actual reports
          setReports([]); // Placeholder
        }
      } catch (error) {
        console.error('Failed to load reports:', error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [searchQuery, categoryFilter, searchParams]);

  const reportTypeMap: Record<string, string> = {
    collection: 'Relatório de Coleta',
    audit: 'Relatório de Auditoria',
    compliance: 'Relatório de Conformidade',
    analytics: 'Relatório Analítico',
    executive: 'Relatório Executivo',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold flex items-center">
            Relatórios da Base de Conhecimento
            {reports.length > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({reports.length} relatórios)
              </span>
            )}
          </h2>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={() => {
              // Clear filters and refresh
            }}
            className="px-3 py-1 text-sm"
          >
            Limpar filtros
          </button>
          
          <Button
            onClick={() => {
              // Export functionality would go here
            }}
            className="btn-secondary px-3 py-1 text-sm"
          >
            Exportar
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full border-2 border-primary b-l-primary w-8 h-8"></div>
          <p className="mt-2 text-muted-foreground">Carregando relatórios...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              Nenhum relatório encontrado com os filtros aplicados.
            </p>
            <div className="mt-4">
              <p className="text-sm">
                Esta seção contém relatórios de coleta, auditoria e análise da base de conhecimento jurídico.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <Caption className="text-left font-medium text-sm mb-2">
                Relatórios disponíveis na base de conhecimento
              </Caption>
              <TableHeader>
                <TableRow>
                  <TableCell className="w-20">ID</TableCell>
                  <TableCell className="w-24">Título</TableCell>
                  <TableCell className="w-20">Tipo</TableCell>
                  <TableCell className="w-16">Data</TableCell>
                  <TableCell className="w-16">Status</TableCell>
                  <TableCell className="w-20">Ações</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id} onClick={() => setSelectedReport(report.id)}>
                    <TableCell className="font-mono text-sm">{report.id}</TableCell>
                    <TableCell className="truncate max-w-48">{report.title}</TableCell>
                    <TableCell>
                      <Badge variant="info" className="px-2 py-0.5 text-xs">
                        {reportTypeMap[report.type as keyof typeof reportTypeMap] || report.type || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {new Date(report.date || report.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={report.status === 'active' ? 'success' : report.status === 'draft' ? 'warning' : 'error'}
                        className="px-2 py-0.5 text-xs"
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Menu>
                        <MenuButton asChild>
                          <Button variant="outline" className="p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M12 5a1 1 0 110 2 1 1 0 010-2zM12 19a1 1 0 110 2 1 1 0 010-2z" />
                            </svg>
                          </button>
                        </MenuButton>
                        <MenuList className="w-48">
                          <MenuItem onClick={() => {
                            // View details
                            setSelectedReport(report.id);
                          }}>
                            Visualizar detalhes
                          </MenuItem>
                          <MenuItem onClick={() => {
                            // Download
                          }}>
                            Fazer download
                          </MenuItem>
                          <MenuItem onClick={() => {
                            // Share
                          }}>
                            Compartilhar
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Selected Report Detail Panel */}
          {selectedReport && (
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Detalhes do Relatório: {selectedReport}
              </h3>
              {/* Report details would be displayed here */}
              <p className="text-muted-foreground">
                Painel de detalhes em desenvolvimento...
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedReport(null)}>
                  Fechar
                </button>
                <Button className="btn-primary">
                  Editar este relatório
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};