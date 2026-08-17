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
import { InfractionsSearchResult, InfractionSeverity } from '../../types/knowledge';
import { knowledgeService } from '../../server/knowledge/knowledge-service';
import { JsonExplorer } from './JsonExplorer';
import { useSearchParams } from 'react-router-dom';

export const InfractionsView: React.FC<{ 
  searchQuery: string; 
  categoryFilter: string | null 
}> = ({ searchQuery, categoryFilter }) => {
  const [infractions, setInfractions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedInfraction, setSelectedInfraction] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadInfractions = async () => {
      setLoading(true);
      try {
        // Use query from props or URL params
        const query = searchQuery || searchParams.get('q') || '';
        const filters: any = {};
        
        if (categoryFilter && categoryFilter !== 'all') {
          filters.category = categoryFilter;
        }
        
        if (query.trim()) {
          const results = await knowledgeService.searchInfractions(query, {
            topK: 20,
            threshold: 0.3,
            filterJurisdiction: 'BR_FEDERAL'
          });
          setInfractions(results);
        } else {
          const allInfractions = knowledgeService.getAllInfractions();
          setInfractions(allInfractions);
        }
      } catch (error) {
        console.error('Failed to load infractions:', error);
        setInfractions([]);
      } finally {
        setLoading(false);
      }
    };

    loadInfractions();
  }, [searchQuery, categoryFilter, searchParams]);

  const severityColors: Record<InfractionSeverity, string> = {
    leve: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    media: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    grave: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    gravissima: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold flex items-center">
            Infrações de Trânsito
            {infractions.length > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({infractions.length} resultados)
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
          <p className="mt-2 text-muted-foreground">Carregando infrações...</p>
        </div>
      ) : infractions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhuma infração encontrada com os filtros aplicados.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <Caption className="text-left font-medium text-sm mb-2">
                Lista de infrações de trânsito
              </Caption>
              <TableHeader>
                <TableRow>
                  <TableCell className="w-20">Código</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell className="w-16">Artigo</TableCell>
                  <TableCell className="w-12">Severidade</TableCell>
                  <TableCell className="w-10">Pontos</TableCell>
                  <TableCell className="w-12">Valor</TableCell>
                  <TableCell className="w-20">Ações</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {infractions.map((infraction) => (
                  <TableRow key={infraction.code} onClick={() => setSelectedInfraction(infraction.code)}>
                    <TableCell className="font-medium">{infraction.code}</TableCell>
                    <TableCell className="truncate max-w-48">{infraction.description}</TableCell>
                    <TableCell className="font-mono text-sm">{infraction.article}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="soft" 
                        className={`${severityColors[infraction.severity as InfractionSeverity]} px-2 py-0.5 text-xs`}
                      >
                        {infraction.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{infraction.points}</TableCell>
                    <TableCell className="text-right font-mono">R$ {infraction.fineAmount?.toFixed(2) ?? '0,00'}</TableCell>
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
                            setSelectedInfraction(infraction.code);
                          }}>
                            Visualizar detalhes
                          </MenuItem>
                          <MenuItem onClick={() => {
                            // Edit (would navigate to edit form)
                          }}>
                            Editar
                          </MenuItem>
                          <MenuItem onClick={() => {
                            // View related arguments
                          }}>
                            Ver argumentos relacionados
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Selected Infraction Detail Panel */}
          {selectedInfraction && (
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Detalhes da Infração: {selectedInfraction}
              </h3>
              {/* Infraction details would be displayed here */}
              <p className="text-muted-foreground">
                Painel de detalhes em desenvolvimento...
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedInfraction(null)}>
                  Fechar
                </button>
                <Button className="btn-primary">
                  Editar esta infração
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};