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
  Textarea,
  HStack,
  VStack,
  Spacer,
  Alert,
  AlertIcon,
} from '@reakit/box';
import { knowledgeService } from '../../server/knowledge/knowledge-service';
import { JsonExplorer } from './JsonExplorer';
import { useSearchParams } from 'react-router-dom';

export const DocumentEngineView: React.FC<{ 
  searchQuery: string; 
  categoryFilter: string | null 
}> = ({ searchQuery, categoryFilter }) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);
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

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(e.target.value);
    // Reset form data when template changes
    setFormData({});
    setPreview('');
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePreview = async () => {
    if (!selectedTemplate || !formData) return;
    
    setGenerating(true);
    try {
      const response = await fetch('/api/knowledge/engine/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate,
          data: formData
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setPreview(result.preview || '');
      } else {
        throw new Error('Failed to generate preview');
      }
    } catch (error) {
      console.error('Failed to generate document preview:', error);
      setPreview('Erro ao gerar pré-visualização do documento');
    } finally {
      setGenerating(false);
    }
  };

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
            Engine de Geração de Documentos Jurídicos
            {templates.length > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({templates.length} templates disponíveis)
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Template Selection */}
            <VStack spacing={4}>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Selecionar Template</h3>
                <Select
                  value={selectedTemplate || ''}
                  onChange={handleTemplateChange}
                  className="w-full mb-4"
                >
                  <option value="">Selecione um template...</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.code})
                    </option>
                  ))}
                </Select>
                
                {selectedTemplate && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <h4 className="font-medium mb-2">Template Selecionado</h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>Nome:</strong> {templates.find(t => t.id === selectedTemplate)?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Código:</strong> {templates.find(t => t.id === selectedTemplate)?.code || 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Procedimento:</strong> {procedureTypeMap[templates.find(t => t.id === selectedTemplate)?.procedureType as keyof typeof procedureTypeMap] || 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Blocos:</strong> {Array.isArray(templates.find(t => t.id === selectedTemplate)?.blocks) ? templates.find(t => t.id === selectedTemplate)?.blocks.length : 0}
                    </p>
                  </div>
                )}
              </div>
            </VStack>
            
            {/* Form Data */}
            <VStack spacing={4}>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Dados do Documento</h3>
                {selectedTemplate ? (
                  <>
                    {/* Dynamic form fields based on template variables would go here */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium mb-1">
                        Variáveis do Template
                      </label>
                      <div className="space-y-2">
                        {/* Example variables - in real implementation, these would come from the template */}
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                          <input
                            type="text"
                            placeholder="placa"
                            value={formData.placa || ''}
                            onChange={(e) => handleFormChange('placa', e.target.value)}
                            className="input input-bordered flex-1"
                          />
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                          <input
                            type="text"
                            placeholder="ait"
                            value={formData.ait || ''}
                            onChange={(e) => handleFormChange('ait', e.target.value)}
                            className="input input-bordered flex-1"
                          />
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                          <input
                            type="text"
                            placeholder="condutor"
                            value={formData.condutor || ''}
                            onChange={(e) => handleFormChange('condutor', e.target.value)}
                            className="input input-bordered flex-1"
                          />
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                          <input
                            type="text"
                            placeholder="data"
                            value={formData.data || ''}
                            onChange={(e) => handleFormChange('data', e.target.value)}
                            className="input input-bordered flex-1"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button
                        onClick={generatePreview}
                        disabled={generating || !selectedTemplate}
                        className="w-full btn-primary"
                      >
                        {generating ? 'Gerando pré-visualização...' : 'Gerar Pré-visualização'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Selecione um template para começar a preencher os dados do documento.
                    </p>
                  </div>
                )}
              </div>
            </VStack>
            
            {/* Preview */}
            <VStack spacing={4}>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Pré-visualização do Documento</h3>
                {preview ? (
                  <div className="prose prose-sm max-w-none">
                    <pre className="bg-gray-50 dark:bg-gray-700 p-4 rounded overflow-x-auto whitespace-pre-wrap">
                      {preview}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Alert variant="soft" className="flex items-center text-sm">
                      <AlertIcon />
                      <span className="ml-3">
                        Nenhuma pré-visualização disponível. Preencha os dados e clique em "Gerar Pré-visualização".
                      </span>
                    </Alert>
                  </div>
                )}
              </div>
            </VStack>
          </div>
        </>
      )}
    </div>
  );
};