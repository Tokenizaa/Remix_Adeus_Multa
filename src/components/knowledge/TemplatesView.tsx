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

export const TemplatesView: React.FC<{ 
  searchQuery: string; 
  categoryFilter: string | null 
}> = ({ searchQuery, categoryFilter }) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true);
      try {
        // Use query from props or URL params
        const query = searchQuery || searchParams.get('q') || '';
        const filters: any = {};
        
        if (categoryFilter && categoryFilter !== 'all') {
          filters.category = categoryFilter;
        }
        
        if (query.trim()) {
          const results = await knowledgeService.searchTemplates(query, {
            topK: 20,
            threshold: 0.3,
            filterJurisdiction: 'BR_FEDERAL'
          });
          setTemplates(results);
        } else {
          const allTemplates = knowledgeService.getAllTemplates();
          setTemplates(allTemplates);
        }
      } catch (error) {
        console.error('Failed to load templates:', error);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, [searchQuery, categoryFilter, searchParams]);

  const procedureTypeMap: Record<string, string> = {
    defensa_previa: 'Defesa Prévia',
    recurso_jari: 'Recurso JARI',
    indicacao: 'Indicação',
    advertencia_escrita: 'Advertência por Escrito',
    pccc: 'PCCC',
    pcdd: 'PCDD',
    jari: 'JARI',
    cetran: 'CETRAN',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold flex items-center">
            Templates de Documentos Jurídicos
            {templates.length > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({templates.length} templates)
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
          <p className="mt-2 text-muted-foreground">Carregando templates...</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhum template encontrado com os filtros aplicados.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <Caption className="text-left font-medium text-sm mb-2">
                Modelos estruturais de peças jurídicas
              </Caption>
              <TableHeader>
                <TableRow>
                  <TableCell className="w-16">ID</TableCell>
                  <TableCell className="w-20">Código</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell className="w-20">Procedimento</TableCell>
                  <TableCell className="w-16">Versão</TableCell>
                  <TableCell className="w-12">Blocos</TableCell>
                  <TableCell className="w-20">Ações</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id} onClick={() => setSelectedTemplate(template.id)}>
                    <TableCell className="font-mono text-sm">{template.id}</TableCell>
                    <TableCell className="font-mono">{template.code}</TableCell>
                    <TableCell className="truncate max-w-48">{template.name}</TableCell>
                    <TableCell>
                      <Badge variant="info" className="px-2 py-0.5 text-xs">
                        {procedureTypeMap[template.procedureType as keyof typeof procedureTypeMap] || template.procedureType || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm">{template.version}</TableCell>
                    <TableCell className="text-center">
                      {Array.isArray(template.blocks) ? template.blocks.length : 0}
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
                            setSelectedTemplate(template.id);
                          }}>
                            Visualizar detalhes
                          </MenuItem>
                          <MenuItem onClick={() => {
                            // View blocks
                          }}>
                            Ver blocos do template
                          </MenuItem>
                          <MenuItem onClick={() => {
                            // View related procedures
                          }}>
                            Ver procedimentos relacionados
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Selected Template Detail Panel */}
          {selectedTemplate && (
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Detalhes do Template: {selectedTemplate}
              </h3>
              {/* Template details would be displayed here */}
              <p className="text-muted-foreground">
                Painel de detalhes em desenvolvimento...
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  Fechar
                </button>
                <Button className="btn-primary">
                  Editar este template
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};