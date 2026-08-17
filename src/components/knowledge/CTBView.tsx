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

export const CTBView: React.FC<{ 
  searchQuery: string; 
  categoryFilter: string | null 
}> = ({ searchQuery, categoryFilter }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        // Use query from props or URL params
        const query = searchQuery || searchParams.get('q') || '';
        const filters: any = {};
        
        if (categoryFilter && categoryFilter !== 'all') {
          filters.category = categoryFilter;
        }
        
        if (query.trim()) {
          const results = await knowledgeService.searchCtbArticles(query, {
            topK: 20,
            threshold: 0.3,
            filterJurisdiction: 'BR_FEDERAL'
          });
          setArticles(results);
        } else {
          const allArticles = knowledgeService.getAllCtbArticles();
          setArticles(allArticles);
        }
      } catch (error) {
        console.error('Failed to load CTB articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [searchQuery, categoryFilter, searchParams]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold flex items-center">
            Código de Trânsito Brasileiro (CTB)
            {articles.length > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({articles.length} artigos)
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
          <p className="mt-2 text-muted-foreground">Carregando artigos do CTB...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhum artigo encontrado com os filtros aplicados.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <Caption className="text-left font-medium text-sm mb-2">
                Artigos do Código de Trânsito Brasileiro
              </Caption>
              <TableHeader>
                <TableRow>
                  <TableCell className="w-20">ID</TableCell>
                  <TableCell>Artigo</TableCell>
                  <TableCell className="w-32">Título</TableCell>
                  <TableCell className="w-20">Categoria</TableCell>
                  <TableCell className="w-16">Infrações Relacionadas</TableCell>
                  <TableCell className="w-20">Ações</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id} onClick={() => setSelectedArticle(article.id)}>
                    <TableCell className="font-mono text-sm">{article.id}</TableCell>
                    <TableCell className="font-medium">{article.article}</TableCell>
                    <TableCell className="truncate max-w-48">{article.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                        {article.category?.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        ).join(' ') || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {Array.isArray(article.related_infractions) ? article.related_infractions.length : 0}
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
                            setSelectedArticle(article.id);
                          }}>
                            Visualizar detalhes
                          </MenuItem>
                          <MenuItem onClick={() => {
                            // View related infractions
                          }}>
                            Ver infrações relacionadas
                          </MenuItem>
                          {article.template_available ? (
                            <MenuItem onClick={() => {
                              // View template
                            }}>
                              Ver template associado
                            </MenuItem>
                          ) : null}
                        </MenuList>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Selected Article Detail Panel */}
          {selectedArticle && (
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Detalhes do Artigo: {selectedArticle}
              </h3>
              {/* Article details would be displayed here */}
              <p className="text-muted-foreground">
                Painel de detalhes em desenvolvimento...
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedArticle(null)}>
                  Fechar
                </button>
                <Button className="btn-primary">
                  Editar este artigo
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};