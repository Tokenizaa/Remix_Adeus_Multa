import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronRight,
  ArrowLeft,
  FileCheck2,
  Scale
} from 'lucide-react';
import {
  ProcedureType,
  InfractionData,
  VehicleData,
  CaseAnalysis,
  CaseDomain,
  CaseAnalysisData,
  CaseDocumentData
} from '../../types';
import { useRouter } from '../../core/router/RouterContext';
import { useAuth } from '../../core/auth/AuthContext';
import { ServiceStep } from './steps/ServiceStep';
import { InfractionTypeStep, InfractionTypeOption } from './steps/InfractionTypeStep';
import { DefenseStageStep, DefenseStageOption } from './steps/DefenseStageStep';
import { InfractionDataStep } from './steps/InfractionDataStep';
import { DocumentUploadStep } from './steps/DocumentUploadStep';
import { DataConfirmationStep } from './steps/DataConfirmationStep';
import { AnalysisProcessingStep } from './steps/AnalysisProcessingStep';
import { FreeAnalysisResultStep } from './steps/FreeAnalysisResultStep';
import { RequiredDataStep } from './generation/RequiredDataStep';
import { DocumentReviewStep } from './generation/DocumentReviewStep';
import { DocumentCheckoutStep } from './generation/DocumentCheckoutStep';

interface OnboardingWizardProps {
  onCaseReadyForCheckout?: (newCase: CaseDomain) => void;
  onOpenKnowledge?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onCaseReadyForCheckout,
  onOpenKnowledge,
}) => {
  const { navigate } = useRouter();
  const { user } = useAuth();

  // Wizard Step State: 1 to 8 (Phase 1 Free Analysis), 9 to 11 (Phase 2 Paid Generation)
  const [step, setStep] = useState<number>(1);

  // =========================================================================
  // FASE 1: DADOS DA ANÁLISE JURÍDICA (100% GRATUITA)
  // =========================================================================
  const [serviceType, setServiceType] = useState<ProcedureType>('defesa_previa');
  const [infractionType, setInfractionType] = useState<InfractionTypeOption>('radar');
  const [defenseStage, setDefenseStage] = useState<DefenseStageOption>('defesa_previa');

  const [vehicleData, setVehicleData] = useState<VehicleData>({
    plate: 'BRA2E19',
    brandModel: 'Toyota Corolla Cross XRE',
    renavam: '00123984712',
    year: '2024',
    color: 'Preto',
  });

  const [infractionData, setInfractionData] = useState<InfractionData>({
    aitNumber: '1B892014',
    infractionCode: '745-50',
    description: 'Transitar em velocidade superior à máxima permitida em até 20%',
    ctbArticle: 'Art. 218, I do CTB',
    severity: 'media',
    points: 4,
    fineAmount: 130.16,
    autuadorBody: 'DETRAN-SP — Departamento Estadual de Trânsito de São Paulo',
    dateTime: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString().replace('T', ' ').substring(0, 16),
    location: 'Av. das Nações Unidas, alt. 14.401 — São Paulo/SP',
    speedLimit: 60,
    measuredSpeed: 71,
    consideredSpeed: 64,
    radarEquipmentId: 'RAD-INMETRO-7819',
    inmetroAferitionDate: '2025-04-12',
    notificationExpeditionDate: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
    defenseDeadline: new Date(Date.now() + 28 * 24 * 3600 * 1000).toISOString().split('T')[0],
    formalFlawsDetected: [
      'Aferição metrológica do radar expirada há mais de 12 meses (Res. 798 CONTRAN)',
      'Ausência de placa de velocidade R-19 regulamentar no trecho fiscalizado',
      'Elegível para conversão em advertência por escrito (Art. 267 CTB)',
    ],
  });

  const [caseAnalysis, setCaseAnalysis] = useState<CaseAnalysis>({
    id: `an_${Date.now()}`,
    caseId: `temp_${Date.now()}`,
    createdAt: new Date().toISOString(),
    overallSuccessRate: 94,
    riskLevel: 'baixo',
    recommendedArguments: [
      {
        id: 'arg_1',
        title: 'Decadência da Notificação de Autuação (Art. 281-A CTB)',
        category: 'decadencia_notificacao',
        ctbArticle: 'Art. 281-A do CTB (Lei 14.071/2020)',
        successProbability: 96,
        description: 'Expedição da Notificação de Autuação superior ao prazo legal de 30 dias contados da data do fato.',
        legalFoundation: 'Art. 281-A do CTB (incluído pela Lei 14.071/2020) e Súmula 312 do STJ.',
      },
      {
        id: 'arg_2',
        title: 'Nulidade Metrológica do Radar (Resolução 798/2020 CONTRAN)',
        category: 'vicio_formal_ait',
        ctbArticle: 'Art. 218 do CTB c/c Res. 798 CONTRAN',
        successProbability: 92,
        description: 'Medidor de velocidade com aferição periódica anual vencida pelo INMETRO no momento do registro.',
        legalFoundation: 'Art. 4º da Resolução CONTRAN nº 798/2020 e Portaria INMETRO nº 544/2014.',
      },
      {
        id: 'arg_3',
        title: 'Direito à Conversão em Advertência por Escrito (Art. 267 CTB)',
        category: 'conversao_advertencia',
        ctbArticle: 'Art. 267 do CTB (Lei 14.071/20)',
        successProbability: 98,
        description: 'Infração de gravidade média cometida sem reincidência de mesma natureza nos últimos 12 meses.',
        legalFoundation: 'Art. 267 do CTB com redação conferida pela Lei Federal nº 14.071/2020.',
      },
    ],
    summary: 'Foram detectadas 3 teses prioritárias de anulação com 94% de probabilidade de acolhimento perante o órgão autuador.',
    rulesTriggeredCount: 3,
  });

  // =========================================================================
  // FASE 2: DADOS DE QUALIFICAÇÃO DO CONDUTOR (GERAÇÃO DA PEÇA)
  // =========================================================================
  const [documentData, setDocumentData] = useState<CaseDocumentData>({
    applicantName: user?.name || 'Carlos Eduardo Silveira',
    applicantCpf: user?.cpf || '123.456.789-00',
    applicantRg: '12.345.678-9 SSP/SP',
    applicantCnh: '05492817492',
    cnhCategory: 'AB',
    applicantPhone: '(11) 98765-4321',
    applicantEmail: user?.email || 'carlos.silveira@email.com',
    addressStreet: 'Rua das Flores',
    addressNumber: '450',
    addressComplement: 'Apto 82',
    addressNeighborhood: 'Vila Madalena',
    addressZipCode: '05445-010',
    addressCityState: 'São Paulo/SP',
    vehicleRenavam: '00123984712',
  });

  const [savedCaseId, setSavedCaseId] = useState<string | undefined>(undefined);

  // Stepper helper
  const isPhase1 = step <= 8;
  const isPhase2 = step >= 9;

  // Handlers for Phase 1
  const handleServiceSelect = (service: ProcedureType) => {
    setServiceType(service);
    setStep(2);
  };

  const handleInfractionTypeSelect = (type: InfractionTypeOption) => {
    setInfractionType(type);
    setStep(3);
  };

  const handleDefenseStageSelect = (stage: DefenseStageOption) => {
    setDefenseStage(stage);
    setStep(4);
  };

  const handleConfirmAndRunAnalysis = () => {
    setStep(7); // Trigger Real Analysis State
  };

  const handleAnalysisCompleted = async () => {
    try {
      // Run deterministic backend analysis
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Diagnóstico Auto ${infractionData.aitNumber || '1B892014'}`,
          serviceType,
          infraction: infractionData,
          vehicle: vehicleData,
          isAnonymous: true,
          status: 'analyzed',
          currentStage: 2,
        }),
      });
      const data = await res.json();
      if (data.id) {
        setSavedCaseId(data.id);
      }
      if (data.analysis) {
        setCaseAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Error triggering case analysis:', err);
    }
    setStep(8); // Show Free Analysis Result
  };

  // Transition to Phase 2
  const handleProceedToDocumentGeneration = () => {
    setStep(9); // Phase 2: Required Data for the Legal Piece
  };

  const handleSaveToDashboard = () => {
    navigate('/dashboard');
  };

  const handlePaymentSuccess = (finalCase: CaseDomain) => {
    if (onCaseReadyForCheckout) {
      onCaseReadyForCheckout(finalCase);
      return; // o callback (App.tsx) decide a rota (/checkout)
    }
    navigate(`/cases/${finalCase.id}`); // fallback se usado sem callback
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb & Phase Indicator GOV.BR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#CCCCCC] rounded-xl p-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
            isPhase1 ? 'bg-[#155BCB] text-white' : 'bg-[#168821] text-white'
          }`}>
            {isPhase1 ? 'F1' : 'F2'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-slate-500">
                {isPhase1 ? 'Fase 1 de 2 • Gratuita' : 'Fase 2 de 2 • Geração da Defesa'}
              </span>
              <span className="text-slate-300">•</span>
              <span className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded ${
                isPhase1 ? 'bg-blue-50 text-[#155BCB] border border-blue-200' : 'bg-emerald-50 text-[#168821] border border-emerald-200'
              }`}>
                {isPhase1 ? 'Diagnóstico Preliminar 100% Gratuito' : 'Minuta Jurídica Formal'}
              </span>
            </div>
            <h2 className="text-xs font-bold text-[#071D41] mt-0.5">
              {step === 1 && '1. Seleção do Procedimento'}
              {step === 2 && '2. Tipo da Infração'}
              {step === 3 && '3. Fase Processual'}
              {step === 4 && '4. Dados da Autuação (Fonte da Verdade)'}
              {step === 5 && '5. Upload Opcional / Conferência'}
              {step === 6 && '6. Confirmação dos Dados'}
              {step === 7 && '7. Processamento da Análise'}
              {step === 8 && '8. Diagnóstico Jurídico Concluído'}
              {step === 9 && '9. Qualificação do Requerente'}
              {step === 10 && '10. Revisão da Peça Jurídica'}
              {step === 11 && '11. Emissão da Petição & Pagamento'}
            </h2>
          </div>
        </div>

        {/* Mini progress tracker */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step
                  ? 'w-6 bg-[#155BCB]'
                  : s < step
                  ? 'w-2.5 bg-[#168821]'
                  : 'w-2.5 bg-slate-200'
              }`}
              title={`Etapa ${s}`}
            />
          ))}
        </div>
      </div>

      {/* Main Flow Router by Step */}
      {step === 1 && (
        <ServiceStep
          selectedService={serviceType}
          onSelectService={handleServiceSelect}
        />
      )}

      {step === 2 && (
        <InfractionTypeStep
          selectedType={infractionType}
          onSelectType={handleInfractionTypeSelect}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <DefenseStageStep
          selectedStage={defenseStage}
          onSelectStage={handleDefenseStageSelect}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <InfractionDataStep
          infractionData={infractionData}
          vehicleData={vehicleData}
          infractionType={infractionType}
          onUpdateInfraction={setInfractionData}
          onUpdateVehicle={setVehicleData}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}

      {step === 5 && (
        <DocumentUploadStep
          infractionData={infractionData}
          vehicleData={vehicleData}
          onUpdateInfraction={setInfractionData}
          onUpdateVehicle={setVehicleData}
          onNext={() => setStep(6)}
          onBack={() => setStep(4)}
        />
      )}

      {step === 6 && (
        <DataConfirmationStep
          infractionData={infractionData}
          vehicleData={vehicleData}
          serviceType={serviceType}
          onEditField={() => setStep(4)}
          onConfirmAndRunAnalysis={handleConfirmAndRunAnalysis}
          onBack={() => setStep(5)}
        />
      )}

      {step === 7 && (
        <AnalysisProcessingStep onComplete={handleAnalysisCompleted} />
      )}

      {step === 8 && (
        <FreeAnalysisResultStep
          analysis={caseAnalysis}
          infractionData={infractionData}
          vehicleData={vehicleData}
          serviceType={serviceType}
          onProceedToDocumentGeneration={handleProceedToDocumentGeneration}
          onSaveToDashboard={handleSaveToDashboard}
        />
      )}

      {step === 9 && (
        <RequiredDataStep
          documentData={documentData}
          infractionData={infractionData}
          vehicleData={vehicleData}
          onUpdateDocumentData={setDocumentData}
          onNext={() => setStep(10)}
          onBack={() => setStep(8)}
        />
      )}

      {step === 10 && (
        <DocumentReviewStep
          documentData={documentData}
          infractionData={infractionData}
          vehicleData={vehicleData}
          analysis={caseAnalysis}
          serviceType={serviceType}
          onEditQualification={() => setStep(9)}
          onProceedToPayment={() => setStep(11)}
          onBack={() => setStep(9)}
        />
      )}

      {step === 11 && (
        <DocumentCheckoutStep
          currentCaseId={savedCaseId}
          documentData={documentData}
          infractionData={infractionData}
          vehicleData={vehicleData}
          analysis={caseAnalysis}
          serviceType={serviceType}
          onPaymentSuccess={handlePaymentSuccess}
          onBack={() => setStep(10)}
        />
      )}
    </div>
  );
};
