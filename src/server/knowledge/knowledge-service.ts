/**
 * @file knowledge-service.ts
 * DefesaAI - Knowledge Service Layer (Fase 5)
 * Centralized service for managing all knowledge entities:
 * CTB, Infractions, Arguments, Templates, Blocks, Procedures, Graph
 */

import { 
  KnowledgeCategoryType, 
  CtbArticleModel, 
  InfractionSeverity,
  ProcedureType,
  KnowledgeCategory,
  ArgumentModel,
  ProcedureModel,
  DocumentTemplateModel,
  TemplateBlock,
  BlockType,
  KnowledgeSource,
  KnowledgeDocument,
  KnowledgeDocumentVersion,
  KnowledgeChunk,
  KnowledgeEmbedding
} from '../../core/domain/knowledge-schema';
import {
  KNOWLEDGE_SOURCES,
  KNOWLEDGE_CTB,
  KNOWLEDGE_RESOLUTIONS,
  KNOWLEDGE_ORDINANCES,
  KNOWLEDGE_ARTICLES,
  KNOWLEDGE_INFRACTIONS,
  KNOWLEDGE_PROCEDURES,
  KNOWLEDGE_TEMPLATES,
  KNOWLEDGE_ARGUMENTS,
  KNOWLEDGE_GRAPH,
  KNOWLEDGE_REPORT,
  KNOWLEDGE_BLOCKS
} from '../../knowledge/index';
import { 
  InfractionCatalogItem, 
  AutuadorBodyInfo,
  LegalArgumentDomain,
  ProcedureModel as LocalProcedureModel,
  DocumentTemplateModel as LocalDocumentTemplateModel,
  TemplateBlock as LocalTemplateBlock,
  OrganModel,
  GlossaryTermModel,
  RuleModel
} from '../../data/knowledge-base';
import { 
  embeddingService, 
  vectorStore, 
  rerankerService,
  SearchKnowledgeOptions,
  KnowledgeSearchResult
} from './index';
import { logger } from '../../observability/logger';
import { metricsService } from '../../observability/metrics-service';

/**
 * Repository interface for knowledge entities
 */
interface KnowledgeRepository<T> {
  findAll(): T[];
  findById(id: string): T | undefined;
  findByIds(ids: string[]): T[];
  create(item: Omit<T, 'id'>): T;
  update(id: string, updates: Partial<T>): T | undefined;
  delete(id: string): boolean;
  search(query: string, options?: SearchKnowledgeOptions): Promise<T[]>;
}

/**
 * Knowledge Service - Main orchestrator for all knowledge operations
 */
export class KnowledgeService {
  private static instance: KnowledgeService;

  // Repositories
  private ctbRepository: KnowledgeRepository<CtbArticleModel & KnowledgeSource>;
  private infractionsRepository: KnowledgeRepository<InfractionCatalogItem & KnowledgeSource>;
  private argumentsRepository: KnowledgeRepository<ArgumentModel & KnowledgeSource>;
  private templatesRepository: KnowledgeRepository<DocumentTemplateModel & KnowledgeSource>;
  private blocksRepository: KnowledgeRepository<TemplateBlock & KnowledgeSource>;
  private proceduresRepository: KnowledgeRepository<ProcedureModel & KnowledgeSource>;
  private graphRepository: KnowledgeRepository<{ 
    infractionId: string; 
    ctbArticleId: string; 
    procedureId: string; 
    argumentIds: string[]; 
    templateId: string 
  } & KnowledgeSource>;

  private constructor() {
    // Initialize repositories with in-memory data
    this.ctbRepository = this.createCtbRepository();
    this.infractionsRepository = this.createInfractionsRepository();
    this.argumentsRepository = this.createArgumentsRepository();
    this.templatesRepository = this.createTemplatesRepository();
    this.blocksRepository = this.createBlocksRepository();
    this.proceduresRepository = this.createProceduresRepository();
    this.graphRepository = this.createGraphRepository();
  }

  public static getInstance(): KnowledgeService {
    if (!KnowledgeService.instance) {
      KnowledgeService.instance = new KnowledgeService();
    }
    return KnowledgeService.instance;
  }

  // ==========================================
  // CTB REPOSITORY
  // ==========================================
  private createCtbRepository(): KnowledgeRepository<CtbArticleModel & KnowledgeSource> {
    const items: (CtbArticleModel & KnowledgeSource)[] = KNOWLEDGE_CTB.map(item => ({
      ...item,
      id: item.id,
      sourceType: 'LAW' as const,
      authority: 'DENATRAN' as const,
      jurisdiction: 'BR_FEDERAL' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    return {
      findAll: () => [...items],
      findById: (id) => items.find(item => item.id === id),
      findByIds: (ids) => items.filter(item => ids.includes(item.id)),
      create: (item) => {
        const newItem = {
          ...item,
          id: `ctb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          sourceType: 'LAW' as const,
          authority: 'DENATRAN' as const,
          jurisdiction: 'BR_FEDERAL' as const,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        items.push(newItem);
        return newItem;
      },
      update: (id, updates) => {
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return undefined;
        items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
        return items[index];
      },
      delete: (id) => {
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return false;
        items.splice(index, 1);
        return true;
      },
      search: async (query, options) => {
        // Use the existing search service for semantic search
        try {
          const results = await embeddingService.generateEmbedding(query, {
            correlationId: options?.correlationId || `ctb_search_${Date.now()}`
          });

          const vectorResults = await vectorStore.searchVectors(results.embedding, {
            topK: options?.topK || 20,
            threshold: options?.threshold ?? 0.30,
            filterSourceId: options?.filterSourceId,
            filterDocumentType: 'LEI',
            filterJurisdiction: options?.filterJurisdiction
          });

          const finalResults = options?.enableReranking ?? true
            ? rerankerService.rerank(query, vectorResults, options?.topN || 5)
            : vectorResults.slice(0, options?.topN || 5);

          // Map search results back to CTB items
          const foundIds = [...new Set(finalResults.map(r => r.documentId))];
          return this.findByIds(foundIds) as unknown as (CtbArticleModel & KnowledgeSource)[];
        } catch (error) {
          logger.error('knowledge', 'ctb_repository', 'search', `Search failed: ${error.message}`);
          return [];
        }
      }
    };
  }

  // ==========================================
  // INFRACTIONS REPOSITORY
  // ==========================================
  private createInfractionsRepository(): KnowledgeRepository<InfractionCatalogItem & KnowledgeSource> {
    const items: (InfractionCatalogItem & KnowledgeSource)[] = KNOWLEDGE_INFRACTIONS.map(item => ({
      ...item,
      id: item.code,
      sourceType: 'REGULATION' as const,
      authority: 'DENATRAN' as const,
      jurisdiction: 'BR_FEDERAL' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    return {
      findAll: () => [...items],
      findById: (id) => items.find(item => item.id === id),
      findByIds: (ids) => items.filter(item => ids.includes(item.id)),
      create: (item) => {
        const newItem = {
          ...item,
          id: item.code,
          sourceType: 'REGULATION' as const,
          authority: 'DENATRAN' as const,
          jurisdiction: 'BR_FEDERAL' as const,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        items.push(newItem);
        return newItem;
      },
      update: (id, updates) => {
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return undefined;
        items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
        return items[index];
      },
      delete: (id) => {
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return false;
        items.splice(index, 1);
        return true;
      },
      search: async (query, options) => {
        try {
          const results = await embeddingService.generateEmbedding(query, {
            correlationId: options?.correlationId || `infractions_search_${Date.now()}`
          });

          const vectorResults = await vectorStore.searchVectors(results.embedding, {
            topK: options?.topK || 20,
            threshold: options?.threshold ?? 0.30,
            filterSourceId: options?.filterSourceId,
            filterDocumentType: 'CATALOGO',
            filterJurisdiction: options?.filterJurisdiction
          });

          const finalResults = options?.enableReranking ?? true
            ? rerankerService.rerank(query, vectorResults, options?.topN || 5)
            : vectorResults.slice(0, options?.topN || 5);

          const foundIds = [...new Set(finalResults.map(r => r.documentId))];
          return this.findByIds(foundIds) as unknown as (InfractionCatalogItem & KnowledgeSource)[];
        } catch (error) {
          logger.error('knowledge', 'infractions_repository', 'search', `Search failed: ${error.message}`);
          return [];
        }
      }
    };
  }

  // ==========================================
  // ARGUMENTS REPOSITORY
  // ==========================================
  private createArgumentsRepository(): KnowledgeRepository<ArgumentModel & KnowledgeSource> {
    const items: (ArgumentModel & KnowledgeSource)[] = KNOWLEDGE_ARGUMENTS.map(item => ({
      ...item,
      id: item.id,
      sourceType: 'TESE_JURIDICA' as const,
      authority: 'DEFESAAI' as const,
      jurisdiction: 'BR_FEDERAL' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    return {
      findAll: () => [...items],
      findById: (id) => items.find(item => item.id === id),
      findByIds: (ids) => items.filter(item => ids.includes(item.id)),
      create: (item) => {
        const newItem = {
          ...item,
          id: item.id,
          sourceType: 'TESE_JURIDICA' as const,
          authority: 'DEFESAAI' as const,
          jurisdiction: 'BR_FEDERAL' as const,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        items.push(newItem);
        return newItem;
      },
      update: (id, updates) => {
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return undefined;
        items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
        return items[index];
      },
      delete: (id) => {
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return false;
        items.splice(index, 1);
        return true;
      },
      search: async (query, options) => {
        try {
          const results = await embeddingService.generateEmbedding(query, {
            correlationId: options?.correlationId || `arguments_search_${Date.now()}`
          });

          const vectorResults = await vectorStore.searchVectors(results.embedding, {
            topK: options?.topK || 20,
            threshold: options?.threshold ?? 0.30,
            filterSourceId: options?.filterSourceId,
            filterDocumentType: 'TESE_JURIDICA',
            filterJurisdiction: options?.filterJurisdiction
          });

          const finalResults = options?.enableReranking ?? true
            ? rerankerService.rerank(query, vectorResults, options?.topN || 5)
            : vectorResults.slice(0, options?.topN || 5);

          const foundIds = [...new Set(finalResults.map(r => r.documentId))];
          return this.findByIds(foundIds) as unknown as (ArgumentModel & KnowledgeSource)[];
        } catch (error) {
          logger.error('knowledge', 'arguments_repository', 'search', `Search failed: ${error.message}`);
          return [];
        }
      }
    };
  }

  // ==========================================
  // TEMPLATES REPOSITORY
  // ==========================================
  private createTemplatesRepository(): KnowledgeRepository<DocumentTemplateModel & KnowledgeSource> {
    const items: (DocumentTemplateModel & KnowledgeSource)[] = KNOWLEDGE_TEMPLATES.map(item => ({
      ...item,
      id: item.id,
      sourceType: 'MODELO' as const,
      authority: 'DEFESAAI' as const,
      jurisdiction: 'BR_FEDERAL' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    return {
      findAll: () => [...items],
      findById: (id) => items.find(item => item.id === id),
      findByIds: (ids) => items.filter(item => ids.includes(item.id)),
      create: (item) => {
        const newItem = {
          ...item,
          id: item.id,
          sourceType: 'MODELO' as const,
          authority: 'DEFESAAI' as const,
          jurisdiction: 'BR_FEDERAL' as const,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        items.push(newItem);
        return newItem;
      },
      update: (id, updates) => {
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return undefined;
        items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
        return items[index];
      },
      delete: (id) => {
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return false;
        items.splice(index, 1);
        return true;
      },
      search: async (query, options) => {
        try {
          const results = await embeddingService.generateEmbedding(query, {
            correlationId: options?.correlationId || `templates_search_${Date.now()}`
          });

          const vectorResults = await vectorStore.searchVectors(results.embedding, {
            topK: options?.topK || 20,
            threshold: options?.threshold ?? 0.30,
            filterSourceId: options?.filterSourceId,
            filterDocumentType: 'MODELO',
            filterJurisdiction: options?.filterJurisdiction
          });

          const finalResults = options?.enableReranking ?? true
            ? rerankerService.rerank(query, vectorResults, options?.topN || 5)
            : vectorResults.slice(0, options?.topN || 5);

          const foundIds = [...new Set(finalResults.map(r => r.documentId))];
          return this.findByIds(foundIds) as unknown as (DocumentTemplateModel & KnowledgeSource)[];
        } catch (error) {
          logger.error('knowledge', 'templates_repository', 'search', `Search failed: ${error.message}`);
          return [];
        }
      }
    };
  }

  // ==========================================
  // BLOCKS REPOSITORY
  // ==========================================
  private createBlocksRepository(): KnowledgeRepository<TemplateBlock & KnowledgeSource> {
    // Flatten all blocks from all templates
    const allBlocks: TemplateBlock[] = [];
    KNOWLEDGE_TEMPLATES.forEach(template => {
      template.blocks.forEach(block => {
        allBlocks.push({ ...block, templateId: template.id });
      });
    });

    const items: (TemplateBlock & KnowledgeSource)[] = allBlocks.map(block => ({
      ...block,
      id: `${block.templateId}_${block.id}`,
      sourceType: 'BLOCO' as const,
      authority: 'DEFESAAI' as const,
      jurisdiction: 'BR_FEDERAL' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    return {
      findAll: () => [...items],
      findById: (id) => items.find(item => item.id === id),
      findByIds: (ids) => items.filter(item => ids.includes(item.id)),
      create: (item) => {
        const newItem = {
          ...item,
          id: `${item.templateId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          sourceType: 'BLOCO' as const,
          authority: 'DEFESAAI' as const,
          jurisdiction: 'BR_FEDERAL' as const,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        items.push(newItem);
        return newItem;
      },
      update: (id, updates) => {
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return undefined;
        items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
        return items[index];
      },
      delete: (id) => {
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return false;
        items.splice(index, 1);
        return true;
      },
      search: async (query, options) => {
        try {
          const results = await embeddingService.generateEmbedding(query, {
            correlationId: options?.correlationId || `blocks_search_${Date.now()}`
          });

          const vectorResults = await vectorStore.searchVectors(results.embedding, {
            topK: options?.topK || 20,
            threshold: options?.threshold ?? 0.30,
            filterSourceId: options?.filterSourceId,
            filterDocumentType: 'BLOCO',
            filterJurisdiction: options?.filterJurisdiction
          });

          const finalResults = options?.enableReranking ?? true
            ? rerankerService.rerank(query, vectorResults, options?.topN || 5)
            : vectorResults.slice(0, options?.topN || 5);

          const foundIds = [...new Set(finalResults.map(r => r.documentId))];
          return this.findByIds(foundIds) as unknown as (TemplateBlock & KnowledgeSource)[];
        } catch (error) {
          logger.error('knowledge', 'blocks_repository', 'search', `Search failed: ${error.message}`);
          return [];
        }
      }
    };
  }

  // ==========================================
  // PROCEDURES REPOSITORY
  // ==========================================
  private createProceduresRepository(): KnowledgeRepository<ProcedureModel & KnowledgeSource> {
    const items: (ProcedureModel & KnowledgeSource)[] = KNOWLEDGE_PROCEDURES.map(item => ({
      ...item,
      id: item.id,
      sourceType: 'PROCEDIMENTO' as const,
      authority: 'DENATRAN' as const,
      jurisdiction: 'BR_FEDERAL' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    return {
      findAll: () => [...items],
      findById: (id) => items.find(item => item.id === id),
      findByIds: (ids) => items.filter(item => ids.includes(item.id)),
      create: (item) => {
        const newItem = {
          ...item,
          id: item.id,
          sourceType: 'PROCEDIMENTO' as const,
          authority: 'DENATRAN' as const,
          jurisdiction: 'BR_FEDERAL' as const,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        items.push(newItem);
        return newItem;
      },
      update: (id, updates) => {
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return undefined;
        items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
        return items[index];
      },
      delete: (id) => {
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return false;
        items.splice(index, 1);
        return true;
      },
      search: async (query, options) => {
        try {
          const results = await embeddingService.generateEmbedding(query, {
            correlationId: options?.correlationId || `procedures_search_${Date.now()}`
          });

          const vectorResults = await vectorStore.searchVectors(results.embedding, {
            topK: options?.topK || 20,
            threshold: options?.threshold ?? 0.30,
            filterSourceId: options?.filterSourceId,
            filterDocumentType: 'PROCEDIMENTO',
            filterJurisdiction: options?.filterJurisdiction
          });

          const finalResults = options?.enableReranking ?? true
            ? rerankerService.rerank(query, vectorResults, options?.topN || 5)
            : vectorResults.slice(0, options?.topN || 5);

          const foundIds = [...new Set(finalResults.map(r => r.documentId))];
          return this.findByIds(foundIds) as unknown as (ProcedureModel & KnowledgeSource)[];
        } catch (error) {
          logger.error('knowledge', 'procedures_repository', 'search', `Search failed: ${error.message}`);
          return [];
        }
      }
    };
  }

  // ==========================================
  // GRAPH REPOSITORY
  // ==========================================
  private createGraphRepository(): KnowledgeRepository<{ 
    infractionId: string; 
    ctbArticleId: string; 
    procedureId: string; 
    argumentIds: string[]; 
    templateId: string 
  } & KnowledgeSource> {
    const items: ({ 
      infractionId: string; 
      ctbArticleId: string; 
      procedureId: string; 
      argumentIds: string[]; 
      templateId: string 
    } & KnowledgeSource)[] = KNOWLEDGE_GRAPH.map(item => ({
      ...item,
      id: `${item.infraction_id}_${item.ctb_article_id}_${item.procedure_id || 'none'}`,
      infractionId: item.infraction_id,
      ctbArticleId: item.ctb_article_id,
      procedureId: item.procedure_id || '',
      argumentIds: item.applicable_arguments || [],
      templateId: item.template_id || '',
      sourceType: 'GRAFO' as const,
      authority: 'DEFESAAI' as const,
      jurisdiction: 'BR_FEDERAL' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    return {
      findAll: () => [...items],
      findById: (id) => items.find(item => item.id === id),
      findByIds: (ids) => items.filter(item => ids.includes(item.id)),
      create: (item) => {
        const newItem = {
          ...item,
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          sourceType: 'GRAFO' as const,
          authority: 'DEFESAAI' as const,
          jurisdiction: 'BR_FEDERAL' as const,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        items.push(newItem);
        return newItem;
      },
      update: (id, updates) => {
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return undefined;
        items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
        return items[index];
      },
      delete: (id) => {
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return false;
        items.splice(index, 1);
        return true;
      },
      search: async (query, options) => {
        try {
          const results = await embeddingService.generateEmbedding(query, {
            correlationId: options?.correlationId || `graph_search_${Date.now()}`
          });

          const vectorResults = await vectorStore.searchVectors(results.embedding, {
            topK: options?.topK || 20,
            threshold: options?.threshold ?? 0.30,
            filterSourceId: options?.filterSourceId,
            filterDocumentType: 'GRAFO',
            filterJurisdiction: options?.filterJurisdiction
          });

          const finalResults = options?.enableReranking ?? true
            ? rerankerService.rerank(query, vectorResults, options?.topN || 5)
            : vectorResults.slice(0, options?.topN || 5);

          const foundIds = [...new Set(finalResults.map(r => r.documentId))];
          return this.findByIds(foundIds) as unknown as ({ 
            infractionId: string; 
            ctbArticleId: string; 
            procedureId: string; 
            argumentIds: string[]; 
            templateId: string 
          } & KnowledgeSource)[];
        } catch (error) {
          logger.error('knowledge', 'graph_repository', 'search', `Search failed: ${error.message}`);
          return [];
        }
      }
    };
  }

  // ==========================================
  // PUBLIC SERVICE METHODS
  // ==========================================

  // CTB Methods
  public getAllCtbArticles(): CtbArticleModel[] {
    return this.ctbRepository.findAll();
  }

  public getCtbArticleById(id: string): CtbArticleModel | undefined {
    return this.ctbRepository.findById(id);
  }

  public searchCtbArticles(query: string, options?: SearchKnowledgeOptions): Promise<CtbArticleModel[]> {
    return this.ctbRepository.search(query, options);
  }

  // Infractions Methods
  public getAllInfractions(): InfractionCatalogItem[] {
    return this.infractionsRepository.findAll();
  }

  public getInfractionById(id: string): InfractionCatalogItem | undefined {
    return this.infractionsRepository.findById(id);
  }

  public searchInfractions(query: string, options?: SearchKnowledgeOptions): Promise<InfractionCatalogItem[]> {
    return this.infractionsRepository.search(query, options);
  }

  // Arguments Methods
  public getAllArguments(): ArgumentModel[] {
    return this.argumentsRepository.findAll();
  }

  public getArgumentById(id: string): ArgumentModel | undefined {
    return this.argumentsRepository.findById(id);
  }

  public searchArguments(query: string, options?: SearchKnowledgeOptions): Promise<ArgumentModel[]> {
    return this.argumentsRepository.search(query, options);
  }

  // Templates Methods
  public getAllTemplates(): DocumentTemplateModel[] {
    return this.templatesRepository.findAll();
  }

  public getTemplateById(id: string): DocumentTemplateModel | undefined {
    return this.templatesRepository.findById(id);
  }

  public searchTemplates(query: string, options?: SearchKnowledgeOptions): Promise<DocumentTemplateModel[]> {
    return this.templatesRepository.search(query, options);
  }

  // Blocks Methods
  public getAllBlocks(): TemplateBlock[] {
    return this.blocksRepository.findAll();
  }

  public getBlockById(id: string): TemplateBlock | undefined {
    return this.blocksRepository.findById(id);
  }

  public searchBlocks(query: string, options?: SearchKnowledgeOptions): Promise<TemplateBlock[]> {
    return this.blocksRepository.search(query, options);
  }

  // Procedures Methods
  public getAllProcedures(): ProcedureModel[] {
    return this.proceduresRepository.findAll();
  }

  public getProcedureById(id: string): ProcedureModel | undefined {
    return this.proceduresRepository.findById(id);
  }

  public searchProcedures(query: string, options?: SearchKnowledgeOptions): Promise<ProcedureModel[]> {
    return this.proceduresRepository.search(query, options);
  }

  // Graph Methods
  public getAllGraphRelationships(): { 
    infractionId: string; 
    ctbArticleId: string; 
    procedureId: string; 
    argumentIds: string[]; 
    templateId: string 
  }[] {
    return this.graphRepository.findAll();
  }

  public getGraphRelationshipById(id: string): { 
    infractionId: string; 
    ctbArticleId: string; 
    procedureId: string; 
    argumentIds: string[]; 
    templateId: string 
  } | undefined {
    return this.graphRepository.findById(id);
  }

  public searchGraphRelationships(query: string, options?: SearchKnowledgeOptions): Promise<{ 
    infractionId: string; 
    ctbArticleId: string; 
    procedureId: string; 
    argumentIds: string[]; 
    templateId: string 
  }[]> {
    return this.graphRepository.search(query, options);
  }

  // Utility Methods
  public getKnowledgeCategories(): KnowledgeCategory[] {
    // Return from the schema file
    // This would need to be imported from knowledge-schema.ts
    // For now, returning empty array - would need proper import
    return [];
  }

  public getInfractionByCode(code: string): InfractionCatalogItem | undefined {
    return this.infractionsRepository.findById(code);
  }

  public getArgumentsByInfractionCode(infractionCode: string): ArgumentModel[] {
    // This would need to be enhanced with actual relationship data
    // For now, return all arguments - in real implementation would filter by relationship
    return this.getAllArguments();
  }
}

export const knowledgeService = KnowledgeService.getInstance();