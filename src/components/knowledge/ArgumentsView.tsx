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

export const ArgumentsView: React.FC<{ 
  searchQuery: string; 
  categoryFilter: string | null 
}> = ({ searchQuery, categoryFilter }) => {
  const [arguments, setArguments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedArgument, setSelectedArgument] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadArguments = async () => {
      setLoading(true);
      try {
        // Use query from props or URL params
        const query = searchQuery || searchParams.get('q') || '';
        const filters: any = {};
        
        if (categoryFilter && categoryFilter !== 'all') {
          filters.category = categoryFilter;
        }
        
        if (query.trim()) {
          const results = await knowledgeService.searchArguments(query, {
            topK: 20,
            threshold: 0.3,
            filterJurisdiction: 'BR_FEDERAL'
          });
          setArguments(results);
        } else {
          const allArguments = knowledgeService.getAllArguments();
          setArguments(allArguments);
        }
      } catch (error) {
        console.error('Failed to load arguments:', error);
        setArguments([]);
      } finally {
        setLoading(false);
      }
    };

    loadArguments();
  }, [searchQuery, categoryFilter, searchParams]);

  const argumentCategoryColors: Record<string, string> = {
    preliminar: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    merito: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    formal: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    constitucional: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold flex items-center">
            Argumentos Jurídicos
            {arguments.length > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({arguments.length} argumentos)
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
          <p className="mt-2 text-muted-foreground">Carregando argumentos jurídicos...</p>
        </div>
      ) : arguments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhum argumento encontrado com os filtros aplicados.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <Caption className="text-left font-medium text-sm mb-2">
                Catálogo de argumentos jurídicos para defesa
              </Caption>
              <TableHeader>
                <TableRow>
                  <TableCell className="w-16">ID</TableCell>
                  <TableCell className="w-20">Código</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell className="w-16">Categoria</TableCell>
                  <TableCell className="w-12">Confiança</TableCell>
                  <TableCell className="w-12">Impacto</TableCell>
                  <TableCell className="w-20">Ações</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {arguments.map((arg) => (
                  <TableRow key={arg.id} onClick={() => setSelectedArgument(arg.id)}>
                    <TableCell className="font-mono text-sm">{arg.id}</TableCell>
                    <TableCell className="font-mono">{arg.code}</TableCell>
                    <TableCell className="truncate max-w-48">{arg.title}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="soft" 
                        className={`${argumentCategoryColors[arg.category as keyof typeof argumentCategoryColors] || 'bg-gray-100 text-gray-800'} px-2 py-0.5 text-xs`}
                      >
                        {arg.category?.charAt(0).toUpperCase() + arg.category?.slice(1) || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {(arg.confidenceScore || 0) > 0 ? `${arg.confidenceScore}%` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {arg.impactType?.replace(/_/g, ' ').split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                      ).join(' ') || 'N/A'}
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
                            setSelectedArgument(arg.id);
                          }}>
                            Visualizar detalhes
                          </MenuItem>
                          <MenuItem onClick={() => {
                            // View related infractions
                          }}>
                            Ver infrações relacionadas
                          </MenuItem>
                          <MenuItem onClick={() => {
                            // View template
                          }}>
                            Ver template associado
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Selected Argument Detail Panel */}
          {selectedArgument && (
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Detalhes do Argumento: {selectedArgument}
              </h3>
              {/* Argument details would be displayed here */}
              <p className="text-muted-foreground">
                Painel de detalhes em desenvolvimento...
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedArgument(null)}>
                  Fechar
                </button>
                <Button className="btn-primary">
                  Editar este argumento
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};