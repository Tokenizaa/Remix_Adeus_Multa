/**
 * Tipos canônicos compartilhados por todos os Agentes Especializados do ecossistema Adeus Multa / DefesAi
 */

export interface UserContext {
  nome: string;
  cpf: string;
  cnh: string;
  rg?: string;
  endereco: string;
  cidade: string;
  uf: string;
  email?: string;
  telefone?: string;
}

export interface InfractionContext {
  placa: string;
  numeroAuto: string;
  orgaoAutuador: string;
  codigoInfracao: string;
  ctbArticle?: string;
  data: string;
  hora?: string;
  local?: string;
  valor?: number;
  pontos?: number;
  gravidade?: 'leve' | 'media' | 'grave' | 'gravissima' | string;
  descricao?: string;
  fotos?: string[];
  velocidadeLimite?: number;
  velocidadeMedida?: number;
  velocidadeConsiderada?: number;
  equipamentoRadar?: string;
  dataAfericaoInmetro?: string;
  dataNotificacao?: string;
  prazoDefesa?: string;
  flaws?: string[];
}

export interface ServiceContext {
  tipo: string;
  preco?: number;
}

export interface OCRFieldResult {
  value: any;
  confidence: number;
}

export interface OCRContext {
  raw_text?: string;
  document_type?: 'notificacao_autuacao' | 'nip' | 'cnh' | 'crlv' | 'ait' | 'unknown' | string;
  confidence?: number;
  method?: 'layout' | 'text' | 'barcode' | 'ml' | string;
  extracted_fields?: Record<string, OCRFieldResult>;
  _meta?: {
    total_fields: number;
    avg_confidence: number;
    parser: string;
  };
}

export interface ValidatedField {
  campo: string;
  valor: any;
  fonte_confianca: number;
  status?: 'valid' | 'invalid' | 'warning';
}

export interface LegalClassification {
  infraction: {
    ctb_article: string;
    code: string;
    description: string;
    severity: 'leve' | 'media' | 'grave' | 'gravissima';
    points: number;
    base_fine: number;
    procedure: 'defesa_previa' | 'recurso_jari' | 'recurso_cetran' | 'conversao_advertencia' | 'indicacao_condutor' | string;
  };
  deadlines: {
    notification_deadline_days: number;
    defense_deadline_days: number;
    notification_date?: string;
    defense_deadline_date?: string;
    days_remaining?: number;
  };
  authority?: {
    name: string;
    sigla: string;
    sphere: 'federal' | 'estadual' | 'municipal';
    address?: string;
    onlinePortal?: string;
  };
}

export interface LegalResearch {
  legal_bases: Array<{
    code: string;
    title: string;
    article: string;
    summary: string;
    jurisprudence?: string[];
  }>;
  jurisprudence: Array<{
    court: string;
    summary: string;
    number?: string;
  }>;
  deadlines: Array<{
    type: string;
    days: number;
    legalBasis: string;
  }>;
  agency_info: Record<string, any>;
}

export interface StrategyArgument {
  id: string;
  code: string;
  title: string;
  legalBase: string;
  summary: string;
  detailedText?: string;
  confidenceScore: number;
  category: 'preliminar' | 'merito' | 'formal' | 'constitucional';
  jurisprudence?: string[];
}

export interface Strategy {
  difficulty?: 'baixa' | 'media' | 'alta';
  estimated_success?: 'muito_provável' | 'provável' | 'possível' | 'baixo' | string;
  selectedArguments: StrategyArgument[];
  risks?: string[];
  recommended_procedure?: string;
  successRate?: number;
}

export interface DocumentSectionPlan {
  id: string;
  type: string;
  title: string;
  required?: boolean;
  order: number;
  content?: string;
  draftedAt?: string;
  changes?: any[];
}

export interface DocumentPlan {
  template: string;
  sections: DocumentSectionPlan[];
  metadata?: {
    serviceType: string;
    generatedAt: string;
    version: string;
    template: string;
  };
}

export interface DocumentDraftContext {
  sections: DocumentSectionPlan[];
  metadata: {
    totalSections: number;
    totalWords: number;
    generatedAt: string;
  };
}

export interface ReviewedDraftContext {
  sections: DocumentSectionPlan[];
  overall: {
    quality: 'alta' | 'media' | 'baixa';
    issuesFound: number;
  };
}

export interface AuditCheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

export interface AuditReport {
  passed: number;
  failed: number;
  warned: number;
  total: number;
  checks: AuditCheckResult[];
  overall: 'pass' | 'fail';
}

export interface HallucinationReport {
  totalClaims: number;
  verified: number;
  suspicious: Array<{
    claim: string;
    reason: string;
    severity: 'high' | 'medium' | 'low';
  }>;
}

export interface ContradictionsReport {
  hasConflicts: boolean;
  conflicts: Array<{
    type: string;
    description: string;
    sections?: string[];
  }>;
}

export interface CompletenessReport {
  complete: boolean;
  sections: Array<{
    id: string;
    title: string;
    required: boolean;
    filled: boolean;
    missingFields: string[];
  }>;
  missing: string[];
  filledRequired: number;
  totalRequired: number;
}

export interface CitationValidationReport {
  total: number;
  valid: number;
  invalid: number;
  details: Array<{
    citation: string;
    valid: boolean;
    source?: string;
  }>;
}

export interface CaseMetadata {
  documentId: string;
  version: string;
  hash: string;
  stepsCompleted: string[];
  validatedFields: ValidatedField[];
  stepTimings?: Record<string | number, number>;
  fieldErrors?: Record<string, number>;
  timeOnCurrentStep?: number;
  converted?: boolean;
  device?: 'mobile' | 'desktop' | 'tablet';
  onboardingConfig?: any;
  simplifiedCopy?: any;
  copy?: any;
  analytics?: any;
  pricing?: any;
  retention?: any;
  [key: string]: any;
}

export interface CaseContext {
  user: UserContext;
  infraction: InfractionContext;
  service: ServiceContext;
  ocr: OCRContext | null;
  validated_fields?: ValidatedField[];
  classification: LegalClassification | null;
  legalResearch: LegalResearch | null;
  strategy: Strategy | null;
  documentPlan: DocumentPlan | null;
  draft: DocumentDraftContext | null;
  reviewedDraft: ReviewedDraftContext | null;
  audit: AuditReport | null;
  hallucinationCheck: HallucinationReport | null;
  contradictions: ContradictionsReport | null;
  completeness: CompletenessReport | null;
  citationValidation?: CitationValidationReport | null;
  pricing?: any;
  documents?: any[];
  documentHtml?: string;
  documentCss?: string;
  documentPageCount?: number;
  metadata: CaseMetadata;
}
