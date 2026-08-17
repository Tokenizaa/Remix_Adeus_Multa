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

export const GraphView: React.FC<{ 
  searchQuery: string; 
  categoryFilter: string | null 
}> = ({ searchQuery, categoryFilter }) => {
  const [graphRelationships, setGraphRelationships] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadGraphRelationships = async () => {
      setLoading(true);
      try {
        // Use query from props or URL params
        const query = searchQuery || searchParams.get('q') || '';
        const filters: any = {};
        
        if (categoryFilter && categoryFilter !== 'all') {
          filters.category = categoryFilter;
        }
        
        if (query.trim()) {
          const results = await knowledgeService.searchGraphRelationships(query, {
            topK: 20,
            threshold: 0.3,
            filterJurisdiction: 'BR_FEDERAL'
          });
          setGraphRelationships(results);
        } else {
          const allRelationships = knowledgeService.getAllGraphRelationships();
          setGraphRelationships(allRelationships);
        }
      } catch (error) {
        console.error('Failed to load graph relationships:', error);
        setGraphRelationships([]);
      } finally {
        setLoading(false);
      }
    };

    loadGraphRelationships();
  }, [searchQuery, categoryFilter, searchParams]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold flex items-center">
            Grafo de Conhecimento Jurídico
            {graphRelationships.length > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({graphRelationships.length} relacionamentos)
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
          <p className="mt-2 text-muted-foreground">Carregando grafo de conhecimento...</p>
        </div>
      ) : graphRelationships.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhum relacionamento encontrado com os filtros aplicados.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <Caption className="text-left font-medium text-sm mb-2">
                Mapeamento relacional: Infração → Artigo CTB → Procedimento → Argumentos → Template
              </Caption>
              <TableHeader>
                <TableRow>
                  <TableCell className="w-20">ID</TableCell>
                  <TableCell className="w-16">Infração</TableCell>
                  <TableCell className="w-16">Artigo CTB</TableCell>
                  <TableCell className="w-16">Procedimento</TableCell>
                  <TableCell className="w-20">Argumentos</TableCell>
                  <TableCell className="w-16">Template</TableCell>
                  <TableCell className="w-20">Ações</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {graphRelationships.map((rel) => (
                  <TableRow key={rel.id} onClick={() => setSelectedRelationship(rel.id)}>
                    <TableCell className="font-mono text-sm">{rel.id}</TableCell>
                    <TableCell className="font-mono text-sm">{rel.infractionId || 'N/A'}</TableCell>
                    <TableCell className="font-mono text-sm">{rel.ctbArticleId || 'N/A'}</TableCell>
                    <TableCell className="font-mono text-sm">{rel.procedureId || 'N/A'}</TableCell>
                    <TableCell className="text-center">
                      {Array.isArray(rel.argumentIds) ? rel.argumentIds.length : 0}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{rel.templateId || 'N/A'}</TableCell>
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
                            setSelectedRelationship(rel.id);
                          }}>
                            Visualizar detalhes
                          </MenuItem>
                          <MenuItem onClick={() => {
                            // View related infraction
                          }}>
                            Ver infração relacionada
                          </MenuItem>
                          <MenuItem onClick={() => {
                            // View related article
                          }}>
                            Ver artigo CTB relacionado
                          </MenuItem>
                          <MenuItem onClick={() => {
                            // View related procedure
                          }}>
                            Ver procedimento relacionado
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Selected Relationship Detail Panel */}
          {selectedRelationship && (
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Detalhes do Relacionamento: {selectedRelationship}
              </h3>
              {/* Relationship details would be displayed here */}
              <p className="text-muted-foreground">
                Painel de detalhes em desenvolvimento...
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedRelationship(null)}>
                  Fechar
                </button>
                <Button className="btn-primary">
                  Editar este relacionamento
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};