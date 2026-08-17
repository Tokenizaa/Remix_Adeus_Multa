import { Router } from 'express';
import { knowledgeService } from '../knowledge/knowledge-service';
import { 
  KnowledgeCategoryType, 
  CtbArticleModel, 
  InfractionSeverity,
  ProcedureType,
  ArgumentModel,
  ProcedureModel,
  DocumentTemplateModel,
  TemplateBlock,
  BlockType
} from '../../core/domain/knowledge-schema';
import { 
  InfractionCatalogItem, 
  AutuadorBodyInfo,
  LegalArgumentDomain,
  OrganModel,
  GlossaryTermModel
} from '../../data/knowledge-base';
import { SearchKnowledgeOptions } from '../knowledge/types';

const router = Router();

/**
 * CTB Endpoints
 */
router.get('/ctb', (req, res) => {
  try {
    const articles = knowledgeService.getAllCtbArticles();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch CTB articles' });
  }
});

router.get('/ctb/:id', (req, res) => {
  try {
    const article = knowledgeService.getCtbArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'CTB article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch CTB article' });
  }
});

router.get('/ctb/search', (req, res) => {
  try {
    const { q, topK, topN, threshold, filterSourceId, filterDocumentType, filterJurisdiction, filterAuthority, enableReranking } = req.query;
    const options: SearchKnowledgeOptions = {
      topK: topK ? parseInt(topK as string) : undefined,
      topN: topN ? parseInt(topN as string) : undefined,
      threshold: threshold ? parseFloat(threshold as string) : undefined,
      filterSourceId: filterSourceId as string,
      filterDocumentType: filterDocumentType as string,
      filterJurisdiction: filterJurisdiction as string,
      filterAuthority: filterAuthority as string,
      enableReranking: enableReranking ? enableReranking === 'true' : undefined
    };
    
    knowledgeService.searchCtbArticles(q as string, options).then(results => {
      res.json(results);
    }).catch(error => {
      res.status(500).json({ error: 'Failed to search CTB articles' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Invalid search parameters' });
  }
});

/**
 * Infractions Endpoints
 */
router.get('/infractions', (req, res) => {
  try {
    const infractions = knowledgeService.getAllInfractions();
    res.json(infractions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch infractions' });
  }
});

router.get('/infractions/:id', (req, res) => {
  try {
    const infraction = knowledgeService.getInfractionById(req.params.id);
    if (!infraction) {
      return res.status(404).json({ error: 'Infraction not found' });
    }
    res.json(infraction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch infraction' });
  }
});

router.get('/infractions/search', (req, res) => {
  try {
    const { q, topK, topN, threshold, filterSourceId, filterDocumentType, filterJurisdiction, filterAuthority, enableReranking } = req.query;
    const options: SearchKnowledgeOptions = {
      topK: topK ? parseInt(topK as string) : undefined,
      topN: topN ? parseInt(topN as string) : undefined,
      threshold: threshold ? parseFloat(threshold as string) : undefined,
      filterSourceId: filterSourceId as string,
      filterDocumentType: filterDocumentType as string,
      filterJurisdiction: filterJurisdiction as string,
      filterAuthority: filterAuthority as string,
      enableReranking: enableReranking ? enableReranking === 'true' : undefined
    };
    
    knowledgeService.searchInfractions(q as string, options).then(results => {
      res.json(results);
    }).catch(error => {
      res.status(500).json({ error: 'Failed to search infractions' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Invalid search parameters' });
  }
});

router.get('/infractions/:infractionCode/arguments', (req, res) => {
  try {
    const arguments = knowledgeService.getArgumentsByInfractionCode(req.params.infractionCode);
    res.json(arguments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch arguments for infraction' });
  }
});

/**
 * Arguments Endpoints
 */
router.get('/arguments', (req, res) => {
  try {
    const arguments = knowledgeService.getAllArguments();
    res.json(arguments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch arguments' });
  }
});

router.get('/arguments/:id', (req, res) => {
  try {
    const argument = knowledgeService.getArgumentById(req.params.id);
    if (!argument) {
      return res.status(404).json({ error: 'Argument not found' });
    }
    res.json(argument);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch argument' });
  }
});

router.get('/arguments/search', (req, res) => {
  try {
    const { q, topK, topN, threshold, filterSourceId, filterDocumentType, filterJurisdiction, filterAuthority, enableReranking } = req.query;
    const options: SearchKnowledgeOptions = {
      topK: topK ? parseInt(topK as string) : undefined,
      topN: topN ? parseInt(topN as string) : undefined,
      threshold: threshold ? parseFloat(threshold as string) : undefined,
      filterSourceId: filterSourceId as string,
      filterDocumentType: filterDocumentType as string,
      filterJurisdiction: filterJurisdiction as string,
      filterAuthority: filterAuthority as string,
      enableReranking: enableReranking ? enableReranking === 'true' : undefined
    };
    
    knowledgeService.searchArguments(q as string, options).then(results => {
      res.json(results);
    }).catch(error => {
      res.status(500).json({ error: 'Failed to search arguments' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Invalid search parameters' });
  }
});

/**
 * Templates Endpoints
 */
router.get('/templates', (req, res) => {
  try {
    const templates = knowledgeService.getAllTemplates();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

router.get('/templates/:id', (req, res) => {
  try {
    const template = knowledgeService.getTemplateById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

router.get('/templates/search', (req, res) => {
  try {
    const { q, topK, topN, threshold, filterSourceId, filterDocumentType, filterJurisdiction, filterAuthority, enableReranking } = req.query;
    const options: SearchKnowledgeOptions = {
      topK: topK ? parseInt(topK as string) : undefined,
      topN: topN ? parseInt(topN as string) : undefined,
      threshold: threshold ? parseFloat(threshold as string) : undefined,
      filterSourceId: filterSourceId as string,
      filterDocumentType: filterDocumentType as string,
      filterJurisdiction: filterJurisdiction as string,
      filterAuthority: filterAuthority as string,
      enableReranking: enableReranking ? enableReranking === 'true' : undefined
    };
    
    knowledgeService.searchTemplates(q as string, options).then(results => {
      res.json(results);
    }).catch(error => {
      res.status(500).json({ error: 'Failed to search templates' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Invalid search parameters' });
  }
});

/**
 * Blocks Endpoints
 */
router.get('/blocks', (req, res) => {
  try {
    const blocks = knowledgeService.getAllBlocks();
    res.json(blocks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
});

router.get('/blocks/:id', (req, res) => {
  try {
    const block = knowledgeService.getBlockById(req.params.id);
    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }
    res.json(block);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch block' });
  }
});

router.get('/blocks/search', (req, res) => {
  try {
    const { q, topK, topN, threshold, filterSourceId, filterDocumentType, filterJurisdiction, filterAuthority, enableReranking } = req.query;
    const options: SearchKnowledgeOptions = {
      topK: topK ? parseInt(topK as string) : undefined,
      topN: topN ? parseInt(topN as string) : undefined,
      threshold: threshold ? parseFloat(threshold as string) : undefined,
      filterSourceId: filterSourceId as string,
      filterDocumentType: filterDocumentType as string,
      filterJurisdiction: filterJurisdiction as string,
      filterAuthority: filterAuthority as string,
      enableReranking: enableReranking ? enableReranking === 'true' : undefined
    };
    
    knowledgeService.searchBlocks(q as string, options).then(results => {
      res.json(results);
    }).catch(error => {
      res.status(500).json({ error: 'Failed to search blocks' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Invalid search parameters' });
  }
});

/**
 * Procedures Endpoints
 */
router.get('/procedures', (req, res) => {
  try {
    const procedures = knowledgeService.getAllProcedures();
    res.json(procedures);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch procedures' });
  }
});

router.get('/procedures/:id', (req, res) => {
  try {
    const procedure = knowledgeService.getProcedureById(req.params.id);
    if (!procedure) {
      return res.status(404).json({ error: 'Procedure not found' });
    }
    res.json(procedure);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch procedure' });
  }
});

router.get('/procedures/search', (req, res) => {
  try {
    const { q, topK, topN, threshold, filterSourceId, filterDocumentType, filterJurisdiction, filterAuthority, enableReranking } = req.query;
    const options: SearchKnowledgeOptions = {
      topK: topK ? parseInt(topK as string) : undefined,
      topN: topN ? parseInt(topN as string) : undefined,
      threshold: threshold ? parseFloat(threshold as string) : undefined,
      filterSourceId: filterSourceId as string,
      filterDocumentType: filterDocumentType as string,
      filterJurisdiction: filterJurisdiction as string,
      filterAuthority: filterAuthority as string,
      enableReranking: enableReranking ? enableReranking === 'true' : undefined
    };
    
    knowledgeService.searchProcedures(q as string, options).then(results => {
      res.json(results);
    }).catch(error => {
      res.status(500).json({ error: 'Failed to search procedures' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Invalid search parameters' });
  }
});

/**
 * Graph Endpoints
 */
router.get('/graph', (req, res) => {
  try {
    const graph = knowledgeService.getAllGraphRelationships();
    res.json(graph);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch graph relationships' });
  }
});

router.get('/graph/:id', (req, res) => {
  try {
    const relationship = knowledgeService.getGraphRelationshipById(req.params.id);
    if (!relationship) {
      return res.status(404).json({ error: 'Graph relationship not found' });
    }
    res.json(relationship);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch graph relationship' });
  }
});

router.get('/graph/search', (req, res) => {
  try {
    const { q, topK, topN, threshold, filterSourceId, filterDocumentType, filterJurisdiction, filterAuthority, enableReranking } = req.query;
    const options: SearchKnowledgeOptions = {
      topK: topK ? parseInt(topK as string) : undefined,
      topN: topN ? parseInt(topN as string) : undefined,
      threshold: threshold ? parseFloat(threshold as string) : undefined,
      filterSourceId: filterSourceId as string,
      filterDocumentType: filterDocumentType as string,
      filterJurisdiction: filterJurisdiction as string,
      filterAuthority: filterAuthority as string,
      enableReranking: enableReranking ? enableReranking === 'true' : undefined
    };
    
    knowledgeService.searchGraphRelationships(q as string, options).then(results => {
      res.json(results);
    }).catch(error => {
      res.status(500).json({ error: 'Failed to search graph relationships' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Invalid search parameters' });
  }
});

/**
 * Knowledge Categories Endpoint
 */
router.get('/categories', (req, res) => {
  try {
    // TODO: Implement proper category retrieval from knowledge-schema
    // For now, return empty array
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch knowledge categories' });
  }
});

/**
 * General Search Endpoint (cross-views)
 */
router.get('/search', (req, res) => {
  try {
    const { q, view, topK, topN, threshold, filterSourceId, filterDocumentType, filterJurisdiction, filterAuthority, enableReranking } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    
    const options: SearchKnowledgeOptions = {
      topK: topK ? parseInt(topK as string) : undefined,
      topN: topN ? parseInt(topN as string) : undefined,
      threshold: threshold ? parseFloat(threshold as string) : undefined,
      filterSourceId: filterSourceId as string,
      filterDocumentType: filterDocumentType as string,
      filterJurisdiction: filterJurisdiction as string,
      filterAuthority: filterAuthority as string,
      enableReranking: enableReranking ? enableReranking === 'true' : undefined
    };
    
    // Route to appropriate repository based on view
    let promise: Promise<any[]>;
    switch (view) {
      case 'ctb':
        promise = knowledgeService.searchCtbArticles(q as string, options);
        break;
      case 'infractions':
        promise = knowledgeService.searchInfractions(q as string, options);
        break;
      case 'arguments':
        promise = knowledgeService.searchArguments(q as string, options);
        break;
      case 'templates':
        promise = knowledgeService.searchTemplates(q as string, options);
        break;
      case 'blocks':
        promise = knowledgeService.searchBlocks(q as string, options);
        break;
      case 'procedures':
        promise = knowledgeService.searchProcedures(q as string, options);
        break;
      case 'graph':
        promise = knowledgeService.searchGraphRelationships(q as string, options);
        break;
      default:
        // Search across all views
        promise = Promise.all([
          knowledgeService.searchCtbArticles(q as string, options),
          knowledgeService.searchInfractions(q as string, options),
          knowledgeService.searchArguments(q as string, options),
          knowledgeService.searchTemplates(q as string, options),
          knowledgeService.searchBlocks(q as string, options),
          knowledgeService.searchProcedures(q as string, options),
          knowledgeService.searchGraphRelationships(q as string, options)
        ]).then(([ctb, infractions, arguments, templates, blocks, procedures, graph]) => {
          return {
            ctb,
            infractions,
            arguments,
            templates,
            blocks,
            procedures,
            graph
          };
        });
    }
    
    promise.then(results => {
      res.json(results);
    }).catch(error => {
      res.status(500).json({ error: 'Failed to search knowledge' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Invalid search parameters' });
  }
});

/**
 * Document Engine Preview Endpoint
 * This will be used by the DocumentEngineView playground
 */
router.post('/engine/preview', (req, res) => {
  try {
    const { templateId, data } = req.body;
    
    if (!templateId) {
      return res.status(400).json({ error: 'Template ID is required' });
    }
    
    const template = knowledgeService.getTemplateById(templateId);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    // Simple template rendering - replace variables with data
    let preview = template.content || '';
    
    // Replace variables in the format {{variable_name}}
    const variableMatches = preview.matchAll(/\{\{([^}]+)\}\}/g);
    for const match of variableMatches {
      const variableName = match[1].trim();
      const value = data[variableName] || `{{${variableName}}}`; // Keep original if not found
      preview = preview.replace(match[0], String(value));
    }
    
    res.json({
      templateId,
      templateName: template.name,
      preview,
      variablesUsed: Object.keys(data),
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate document preview' });
  }
});

export default router;