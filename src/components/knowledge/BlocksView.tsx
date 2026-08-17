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

export const BlocksView: React.FC<{ 
  searchQuery: string; 
  categoryFilter: string | null 
}> = ({ searchQuery, categoryFilter }) => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadBlocks = async () => {
      setLoading(true);
      try {
        // Use query from props or URL params
        const query = searchQuery || searchParams.get('q') || '';
        const filters: any = {};
        
        if (categoryFilter && categoryFilter !== 'all') {
          filters.category = categoryFilter;
        }
        
        if (query.trim()) {
          const results = await knowledgeService.searchBlocks(query, {
            topK: 20,
            threshold: 0.3,
            filterJurisdiction: 'BR_FEDERAL'
          });
          setBlocks(results);
        } else {
          const allBlocks = knowledgeService.getAllBlocks();
          setBlocks(allBlocks);
        }
      } catch (error) {
        console.error('Failed to load blocks:', error);
        setBlocks([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlocks();
  }, [searchQuery, categoryFilter, searchParams]);

  const blockTypeMap: Record<string, string> = {
    header_addressing: 'Cabeçalho e Endereçamento',
    applicant_qualification: 'Qualificação do Impetrante',
    vehicle_qualification: 'Qualificação do Veículo',
    facts_narrative: 'Narração dos Fatos',
    preliminary_arguments: 'Argumentos Preliminares',
    merit_arguments: 'Argumentos de Mérito',
    formal_requests: 'Pedidos Formais',
    closing_signature: 'Encerramento e Assinatura',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold flex items-center">
            Blocos de Documentos Jurídicos
            {blocks.length > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({blocks.length} blocos)
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
          <p className="mt-2 text-muted-foreground">Carregando blocos...</p>
        </div>
      ) : blocks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhum bloco encontrado com os filtros aplicados.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <Caption className="text-left font-medium text-sm mb-2">
                Biblioteca canônica de blocos para montagem modular de petições
              </Caption>
              <TableHeader>
                <TableRow>
                  <TableCell className="w-20">ID</TableCell>
                  <TableCell className="w-20">Tipo</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell className="w-16">Obrigatório</TableCell>
                  <TableCell className="w-20">Template Associado</TableCell>
                  <TableCell className="w-20">Ações</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blocks.map((block) => (
                  <TableRow key={block.id} onClick={() => setSelectedBlock(block.id)}>
                    <TableCell className="font-mono text-sm">{block.id}</TableCell>
                    <TableCell>
                      <Badge variant="info" className="px-2 py-0.5 text-xs">
                        {blockTypeMap[block.type as keyof typeof blockTypeMap] || block.type || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="truncate max-w-48">{block.title}</TableCell>
                    <TableCell className="text-center">
                      {block.isMandatory ? (
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400">Sim</span>
                      ) : (
                        <span className="text-xs font-semibold text-gray-500">Não</span>
                      )}
                    </TableCell>
                    <TableCell className="truncate max-w-32">
                      {Array.isArray(block.supportedVariables) && block.supportedVariables.length > 0
                        ? block.supportedVariables.join(', ')
                        : 'Nenhuma'
                      }
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
                            setSelectedBlock(block.id);
                          }}>
                            Visualizar detalhes
                          </MenuItem>
                          <MenuItem onClick={() => {
                            // View template
                          }}>
                            Ver template associado
                          </MenuItem>
                          <MenuItem onClick={() => {
                            // View variables
                          }}>
                            Ver variáveis suportadas
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Selected Block Detail Panel */}
          {selectedBlock && (
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Detalhes do Bloco: {selectedBlock}
              </h3>
              {/* Block details would be displayed here */}
              <p className="text-muted-foreground">
                Painel de detalhes em desenvolvimento...
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedBlock(null)}>
                  Fechar
                </button>
                <Button className="btn-primary">
                  Editar este bloco
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};