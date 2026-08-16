/**
 * @file rag-pipeline.ts
 * Shared Kernel RAG & Domain Pipeline for DefesaAI (ADR 013 & Fases 1-8)
 * Integrates the deterministic Expert Rule Engine, Document Assembly Engine,
 * and Knowledge Base.
 */

import { INFRACTION_CATALOG, InfractionCatalogItem } from '../../data/knowledge-base';
import { ExpertRuleEngine } from '../rules/rule-engine';
import { DocumentAssemblyEngine } from '../documents/document-assembly-engine';
import { InfractionData, LegalArgumentDomain, CaseAnalysis, DefenseDraft, ProcedureType } from '../../types';

export class RagPipeline {
  /**
   * Find matching infraction in catalog by code or description
   */
  public static findInfraction(codeOrQuery: string): InfractionCatalogItem | undefined {
    const clean = codeOrQuery.replace(/[^0-9]/g, '');
    return (
      INFRACTION_CATALOG.find((item) => {
        const itemCodeClean = item.code.replace(/[^0-9]/g, '');
        return itemCodeClean.includes(clean) || clean.includes(itemCodeClean);
      }) || INFRACTION_CATALOG[0]
    );
  }

  /**
   * Run comprehensive legal heuristic analysis on infraction data via Expert Rule Engine
   */
  public static analyzeInfraction(caseId: string, infraction: InfractionData): CaseAnalysis {
    return ExpertRuleEngine.evaluate(caseId, infraction);
  }

  /**
   * Generate complete, formatted legal defense draft petition via Document Assembly Engine
   */
  public static generateDefenseDraft(
    caseId: string,
    infraction: InfractionData,
    vehiclePlate: string,
    vehicleModel: string,
    applicantData: {
      name: string;
      cpf: string;
      rg?: string;
      cnh: string;
      address: string;
      cityState: string;
    },
    selectedArguments: LegalArgumentDomain[],
    procedureType: ProcedureType = 'defesa_previa'
  ): DefenseDraft {
    return DocumentAssemblyEngine.assemble({
      caseId,
      procedureType,
      infraction,
      vehicle: {
        plate: vehiclePlate,
        model: vehicleModel,
        renavam: '12345678900',
      },
      applicant: applicantData,
      selectedArgumentIds: selectedArguments.map((a) => a.id),
    });
  }
}
