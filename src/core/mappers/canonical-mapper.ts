/**
 * @file canonical-mapper.ts
 * Canonical Mapper enforcing strict Row (database/snake_case) ↔ Domain (frontend/camelCase) separation.
 */

import { CaseDomain, CaseRow, ProcedureType, InfractionSeverity, CaseStatus, JourneyStage } from '../../types';

export class CanonicalMapper {
  /**
   * Convert database Row (snake_case) to Frontend Domain (camelCase)
   */
  public static rowToDomain(row: CaseRow): CaseDomain {
    let formalFlaws: string[] = [];
    if (row.formal_flaws_json) {
      try {
        formalFlaws = JSON.parse(row.formal_flaws_json);
      } catch (e) {
        formalFlaws = [];
      }
    }

    let analysis = undefined;
    if (row.analysis_json) {
      try {
        analysis = JSON.parse(row.analysis_json);
      } catch (e) {
        analysis = undefined;
      }
    }

    let defenseDraft = undefined;
    if (row.defense_draft_json) {
      try {
        defenseDraft = JSON.parse(row.defense_draft_json);
      } catch (e) {
        defenseDraft = undefined;
      }
    }

    let protocolInfo = undefined;
    if (row.protocol_info_json) {
      try {
        protocolInfo = JSON.parse(row.protocol_info_json);
      } catch (e) {
        protocolInfo = undefined;
      }
    }

    let timeline = [];
    if (row.timeline_json) {
      try {
        timeline = JSON.parse(row.timeline_json);
      } catch (e) {
        timeline = [];
      }
    }

    return {
      id: row.id,
      title: row.title || `Recurso Auto ${row.ait_number}`,
      clientName: row.client_name,
      clientEmail: row.client_email,
      clientPhone: row.client_phone,
      clientCpf: row.client_cpf,
      status: (row.status as CaseStatus) || 'novo',
      currentStage: (row.current_stage as JourneyStage) || 1,
      serviceType: (row.service_type as ProcedureType) || 'defesa_previa',
      vehicle: {
        plate: row.vehicle_plate || 'SEM PLACA',
        brandModel: row.vehicle_brand_model || 'Veículo não informado',
        renavam: row.vehicle_renavam,
        chassis: row.vehicle_chassis,
        year: row.vehicle_year,
        color: row.vehicle_color,
      },
      infraction: {
        aitNumber: row.ait_number,
        infractionCode: row.infraction_code,
        description: row.infraction_description,
        ctbArticle: row.ctb_article,
        severity: (row.severity as InfractionSeverity) || 'grave',
        points: Number(row.points) || 0,
        fineAmount: Number(row.fine_amount) || 0,
        autuadorBody: row.autuador_body,
        dateTime: row.date_time,
        location: row.location,
        speedLimit: row.speed_limit,
        measuredSpeed: row.measured_speed,
        consideredSpeed: row.considered_speed,
        radarEquipmentId: row.radar_equipment_id,
        inmetroAferitionDate: row.inmetro_aferition_date,
        notificationExpeditionDate: row.notification_expedition_date,
        defenseDeadline: row.defense_deadline,
        formalFlawsDetected: formalFlaws,
      },
      analysis,
      defenseDraft,
      protocolInfo,
      timeline,
      isAnonymous: Boolean(row.is_anonymous),
      claimToken: row.claim_token,
      isPaid: Boolean(row.is_paid),
      paidAt: row.paid_at,
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString(),
    };
  }

  /**
   * Convert Frontend Domain (camelCase) to Database Row (snake_case)
   */
  public static domainToRow(domain: CaseDomain): CaseRow {
    return {
      id: domain.id,
      title: domain.title,
      client_name: domain.clientName,
      client_email: domain.clientEmail,
      client_phone: domain.clientPhone,
      client_cpf: domain.clientCpf,
      status: domain.status,
      current_stage: domain.currentStage,
      service_type: domain.serviceType,
      vehicle_plate: domain.vehicle.plate,
      vehicle_brand_model: domain.vehicle.brandModel,
      vehicle_renavam: domain.vehicle.renavam,
      vehicle_chassis: domain.vehicle.chassis,
      vehicle_year: domain.vehicle.year,
      vehicle_color: domain.vehicle.color,
      ait_number: domain.infraction.aitNumber,
      infraction_code: domain.infraction.infractionCode,
      infraction_description: domain.infraction.description,
      ctb_article: domain.infraction.ctbArticle,
      severity: domain.infraction.severity,
      points: domain.infraction.points,
      fine_amount: domain.infraction.fineAmount,
      autuador_body: domain.infraction.autuadorBody,
      date_time: domain.infraction.dateTime,
      location: domain.infraction.location,
      speed_limit: domain.infraction.speedLimit,
      measured_speed: domain.infraction.measuredSpeed,
      considered_speed: domain.infraction.consideredSpeed,
      radar_equipment_id: domain.infraction.radarEquipmentId,
      inmetro_aferition_date: domain.infraction.inmetroAferitionDate,
      notification_expedition_date: domain.infraction.notificationExpeditionDate,
      defense_deadline: domain.infraction.defenseDeadline,
      formal_flaws_json: JSON.stringify(domain.infraction.formalFlawsDetected || []),
      analysis_json: domain.analysis ? JSON.stringify(domain.analysis) : undefined,
      defense_draft_json: domain.defenseDraft ? JSON.stringify(domain.defenseDraft) : undefined,
      protocol_info_json: domain.protocolInfo ? JSON.stringify(domain.protocolInfo) : undefined,
      timeline_json: JSON.stringify(domain.timeline || []),
      is_anonymous: domain.isAnonymous,
      claim_token: domain.claimToken,
      is_paid: domain.isPaid,
      paid_at: domain.paidAt,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
    };
  }
}
