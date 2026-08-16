// DefesaAI Canonical Knowledge Base v1 Module
import sourcesData from '../../knowledge/sources/sources.json';
import ctbData from '../../knowledge/legislation/laws/ctb.json';
import resolutionsData from '../../knowledge/legislation/resolutions/contran.json';
import ordinancesData from '../../knowledge/legislation/ordinances/senatran.json';
import articlesData from '../../knowledge/articles/articles.json';
import infractionsData from '../../knowledge/infractions/infractions.json';
import proceduresData from '../../knowledge/procedures/procedures.json';
import templatesData from '../../knowledge/templates/templates.json';
import argumentsData from '../../knowledge/arguments/arguments.json';
import knowledgeGraphData from '../../knowledge/relationships/knowledge-graph.json';
import reportData from '../../knowledge/reports/collection-report.json';
import blocksData from '../../knowledge/blocks/document-blocks.json';

export interface OfficialSource {
  id: string;
  name: string;
  official_body: string;
  official_url: string;
  collection_date: string;
  status: string;
  last_major_amendments: string[];
  verification_signature: string;
}

export interface NormalizedArticle {
  id: string;
  source: string;
  article: string;
  title: string;
  text: string;
  category: string;
  related_infractions: string[];
  official_source: string;
  status: string;
}

export interface PriorityInfraction {
  id: string;
  code: string;
  description: string;
  ctb_article: string;
  severity: 'leve' | 'media' | 'grave' | 'gravissima';
  points: number;
  penalty: string;
  administrative_measures: string;
  related_documents: string[];
  possible_defenses: string[];
}

export interface SupportedService {
  id: string;
  name: string;
  description: string;
  deadline: string;
  when_applies: string;
  legal_basis: string;
  required_documents: string[];
  related_articles: string[];
  template_available: boolean;
}

export interface DefenseTemplateStructure {
  type: string;
  code: string;
  description: string;
  sections: string[];
  variables: string[];
}

export interface SpecializedArgument {
  id: string;
  code: string;
  title: string;
  category: string;
  legal_base: string;
  resolutions: string[];
  jurisprudence: string[];
  description: string;
  when_to_use: string[];
  required_evidence: string[];
  success_rate_estimate: string;
}

export interface KnowledgeGraphNode {
  infraction_id: string;
  infraction_code: string;
  ctb_article_id: string;
  ctb_article_number: string;
  applicable_procedures: {
    procedure_id: string;
    procedure_name: string;
    applicable_arguments: string[];
    template_id: string;
  }[];
}

export const KNOWLEDGE_SOURCES = sourcesData as OfficialSource[];
export const KNOWLEDGE_CTB = ctbData;
export const KNOWLEDGE_RESOLUTIONS = resolutionsData;
export const KNOWLEDGE_ORDINANCES = ordinancesData;
export const KNOWLEDGE_ARTICLES = articlesData as NormalizedArticle[];
export const KNOWLEDGE_INFRACTIONS = infractionsData as PriorityInfraction[];
export const KNOWLEDGE_PROCEDURES = proceduresData as SupportedService[];
export const KNOWLEDGE_TEMPLATES = templatesData as unknown as DefenseTemplateStructure[];
export const KNOWLEDGE_ARGUMENTS = argumentsData as unknown as SpecializedArgument[];
export const KNOWLEDGE_GRAPH = knowledgeGraphData as KnowledgeGraphNode[];
export const KNOWLEDGE_REPORT = reportData;
export const KNOWLEDGE_BLOCKS = blocksData;

