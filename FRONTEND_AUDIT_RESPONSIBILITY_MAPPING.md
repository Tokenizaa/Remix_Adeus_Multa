# MAPEAMENTO DE RESPONSABILIDADES - FRONTEND AUDIT

Este documento mapeia claramente onde cada responsabilidade deveria residir na arquitetura, identificando o que está atualmente no lugar errado.

## PRINCÍPIOS GUIA

### FRONTEND (DEVE PERMANECER APENAS)
- UI/Presentacão: layout, componentes visuais, estilos, temas
- Estado de apresentação: loading states, UI flags, form states temporários
- Navegação: roteamento client-side, history management
- Interacão: event handlers, validações de formulário básicas, feedback imediato
- Acessibilidade: gerenciamento de foco, announcements, navegação por teclado
- Responsividade: media queries, adaptações de layout
- Internacionalização: troca de idiomas, formatação de datas/números para exibição
- Integração com backend: chamada a APIs, transformação de dados para exibição

### BACKEND/DOMÍNIO (DEVE RESIDIR AQUI)
- Regras de negócio: validações complexas, cálculos, decisões condicionais
- Processamento de dados: transformação, enriquecimento, agregações
- Lógica de domínio: interpretação de códigos, aplicação de regras jurídicas
- Tomada de decisão: determinar elegibilidade, calcular probabilidades, sugerir ações
- Processamento de pagamento: validação, conciliação, detecção de fraude
- Integrações externas: comunicação com serviços de terceiros (PagBank, Meta, etc.)
- Segurança: autenticação, autorização, criptografia, validação de entrada
- Persistência preparatória: preparação de dados para salvamento (não o ato de salvar)

### BANCO (DEVE RESIDIR AQUI)
- Consultas complexas: joins, agregações, filtros avançados
- Lógica de consistência: constraints, triggers, regras de integridade
- Procedimentos armazenados: quando absolutamente necessário
- Índices e otimizações: estrutura física de armazenamento
- Esquema: definição de tabelas, colunas, relacionamentos
- Migrações: alterações estruturais no banco de dados

### INTEGRAÇÕES (DEVE RESIDIR NO BACKEND)
- Comunicação com serviços externos: PagBank, Meta Graph API, Supabase, OCR, WhatsApp
- Tratamento de webhooks: recebimento, validação, processamento
- Troca de tokens: refresh, validação, armazenamento seguro
- Formatação específica de APIs: adaptação às necessidades de cada serviço
- Tratamento de erros específicos de serviços: timeouts, limites de taxa, códigos de erro

## MAPEAMENTO POR COMPONENTE

### COMPONENTES COM PROBLEMAS GRAVES DE SEPARAÇÃO

#### OnboardingWizard (/novo-caso)
**LOCALIZAÇÃO ATUAL INCORRETA:** Frontend
**RESPONSABILIDADES INCORRETAMENTE NO FRONTEND:**
- Dados hardcoded de veículo (placa, brandModel, renavam, year, color)
- Dados hardcoded de infração (aitNumber, código, descrição, artigo CTB, severidade, pontos, valor, órgão autuador, data/hora, local, limites de velocidade, IDs de equipamento, datas de aferição, prazos, vícios formais detectados)
- Análise jurídica hardcoded (argumentos específicos com IDs, títulos, categorias, base legal, resoluções CONTRAN, resumos, textos detalhados, scores de confiança, notas de aplicabilidade, infrações aplicáveis)
- Dados hardcoded do requerente (nome, CPF, RG, CNH, categoria CNH, telefone, email, endereço, renavam do veículo)
**LOCALIZAÇÃO CORRETA:** Backend/Domínio
**JUSTIFICATIVA:** O frontend deveria coletar apenas o estritamente necessário do usuário para iniciar o processo, reconhecendo que a extração automática de dados via OCR tem limitações devido à variação de documentos entre diferentes órgãos de trânsito. O frontend deve funcionar como um coletor de dados essenciais com suporte de OCR como assistente, não como fonte única de verdade.
**AÇÃO RECOMENDADA:** 
1. Manter apenas campos de entrada essenciais que o usuário deve fornecer:
   - Número do AIT (objetivamente necessário para identificar o auto)
   - Placa do veículo (recomendado para melhoria da precisão, mas opcional se o AIT for suficiente)
   - Upload de documento (foto/PDF) para tentativa de OCR como assistente
   - Seleção do órgão emissor (para aplicar regras específicas de jurisdição)
2. Implementar auto-preenchimento para usuários cadastrados (dados do veículo/requerente históricos)
3. O backend deve receber esses dados mínimos e realizar:
   - Tentativa de OCR no documento enviado (se fornecido)
   - Consulta a bancos públicos para complementar dados (INMETRO, etc.)
   - Validação e complementação dos dados do AIT e placa
   - Toda análise jurídica, geração de argumentos, sugestão de procedimento, etc.
4. O frontend deve receber do backend apenas o necessário para exibição:
   - Etapa 1: Lista de vícios formais detectados, teses recomendadas com resumos e probabilidades
   - Etapa 2: Documento jurídico gerado pronto para visualização/edição
5. Toda análise jurídica, geração de argumentos, sugestão de procedimento, etc. deve ficar no backend

#### MarketingOSView (/admin/marketing)
**LOCALIZAÇÃO ATUAL INCORRETA:** Frontend
**RESPONSABILIDADES INCORRETAMENTE NO FRONTEND:**
- Estado local réplica dos 7 agentes de marketing (agents state)
- Estado local réplica dos conteúdos editoriais (contents state)
- Estado local réplica da conexão Meta (metaState state)
- Gerenciamento de estado de publicação em andamento (isPublishing, publishResult)
- Estado do modal de conexão Meta (showMetaConnectModal, manualToken)
**LOCALIZAÇÃO CORRETA:** Backend
**JUSTIFICATIVA:** O frontend está mantendo réplicas locais de estado que deveriam ser única fonte de verdade no backend, violando o princípio de única fonte de verdade e criando potencial para inconsistências.
**AÇÃO RECOMENDADA:**
1. ELIMINAR réplicas locais de estado do backend
2. Manter APENAS estado de UI temporário no frontend:
   - Estado de formulário aberto/fechado
   - Estados de carregamento (loading states)
   - Estados de mensagem de feedback (success/error)
   - Estado de visualização de conteúdo selecionado (temporary UI state)
3. Buscar dados do backend quando necessário via APIs:
   - GET `/api/marketing/status` para agentes e conteúdos
   - GET `/api/meta/status` para conexão Meta
   - Outros endpoints específicos conforme necessário
4. Enviar comandos para o backend para alterações de estado:
   - POST `/api/marketing/cycle-tick` para executar ciclo
   - POST `/api/marketing/generate-content` para gerar conteúdo
   - POST `/api/marketing/publish` para publicar conteúdo
   - POST `/api/meta/connect` para conectar Meta
   - POST `/api/meta/disconnect` para desconectar Meta
5. O backend deve ser a ÚNICA fonte de verdade para todo o estado de negócio

### COMPONENTES COM PROBLEMAS MODERADOS

#### AdminCaseDetailView (/admin/cases/:id)
**LOCALIZAÇÃO ATUAL QUE PODE SER MELHORADA:** Frontend
**RESPONSABILIDADES QUE PODEM SER MOVIDAS:**
- Determinação se está pago a partir de múltiplas fontes (isPaid, payment.status)
- Extração de teses para exibição
- Extração de vícios formais para exibição
- Matching de texto para encontrar informações do órgão autuador
**LOCALIZAÇÃO CORRETA:** Backend (para dados derivados)
**JUSTIFICATIVA:** Embora a maioria do que o componente faz seja apresentacão legítima, algumas operações simples de domínio poderiam ser feitas no backend para retornar dados já prontos para exibição.
**AÇÃO RECOMENDADA:**
1. Backend deveria retornar propriedades derivadas prontas para uso:
   - `isPaidAlready`: boolean simples
   - `hasDefenseDraft`: boolean simples
   - `formattedTheses`: array de objetos pronto para exibição na UI
   - `formattedFormalFlaws`: array pronto para exibição na UI
   - `autuadorInfo`: objeto com nome, endereço, URL de protocolo físico e online
2. Frontend foca exclusivamente em:
   - Estado de UI (abas ativas, modos de edição, etc.)
   - Apresentacão dos dados recebidos
   - Interacões do usuário (navegação entre abas, edição, etc.)

#### CheckoutView (/checkout)
**LOCALIZAÇÃO ATUAL QUE PODE SER MELHORADA:** Frontend
**RESPONSABILIDADE INCORRETA NO FRONTEND:**
- Valor hardcodado do pagamento (97.0)
**LOCALIZAÇÃO CORRETA:** Backend ou caso dos dados
**JUSTIFICATIVA:** O frontend está assumindo um valor fixo em vez de obterlo do caso ou do serviço de preços apropriado.
**AÇÃO RECOMENDADA:**
1. Obter o valor do pagamento do caso (currentCase.payment?.amount) ou de um serviço de preços
2. Nunca deixar o frontend assumir valores de pagamento fixos
3. Mantido o restante: gerenciamento de estado de UI e chamada à API de pagamento são apropriados

### COMPONENTES COM SEPARAÇÃO ADEQUADA (MANTER COMO ESTÃO)

#### LandingPageView (/)
- **STATUS:** Adequado
- **JUSTIFICATIVA:** Componente puramente presentacional sem lógica de negócio ou estado complexo. Apenas apresenta informações e navega.

#### LoginPageView (/login) & RegisterPageView (/cadastro)
- **STATUS:** Adequado com pequenas observações
- **JUSTIFICATIVA:** 
  - Validações de formulário básicas (obrigatório, formato de email, senha mínima) são apropriadas no frontend
  - Redirecionamento baseado em papel do usuário é aceitável como está, embora possa ser movido para o serviço de auth se ficar mais complexo
  - Manipulação de usuários demo é aceitável para ambiente de desenvolvimento/teste

#### UserDashboardView (/dashboard), CasesListView (/cases)
- **STATUS:** Adequado
- **JUSTIFICATIVA:** 
  - Componentes que recebem dados como props e fazem apenas agregações simples para exibição
  - Nenhuma lógica de negócio complexa ou acesso direto a banco
  - Operações de UI legítimas: filtragem, cálculos simples de métricas para exibição

#### CaseDetailView (/cases/:id)
- **STATUS:** Adequado com pequenas observações
- **JUSTIFICATIVA:** 
  - Principalmente gerenciamento de estado de UI e apresentacão de dados
  * O matching de texto para órgão autuador poderia ser melhorado no backend, mas não é grave
  * Estado de UI legítimo: estágio ativo, modo de edição, etc.

#### AdminCasesListView (/admin/cases)
- **STATUS:** Adequado
- **JUSTIFICATIVA:** Componente de listagem com filtragem simples e simulação de pagamento apropriada para contexto de admin/demo.

#### AdminCommercialPricesView (/admin/commercial/prices)
- **STATUS:** Adequado com observação
- **JUSTIFICATIVA:** 
  - Implementação típica e razoável de uma view de administração de preços
  - A advertência de regra de negócio (linhas 123-132) é útil e deve ser mantida - está informando o usuário, não tomando decisões
  * Considerar extrair lógica de formulário para hooks customizados se houver muitas formas semelhantes, mas não há problemas significativos de separação de responsabilidades

## RESUMO DOS PROBLEMAS CRÍTICOS IDENTIFICADOS

1. **OnboardingWizard**: Violação severa da separação de responsabilidades - frontend funcionando como simulador completo de caso em vez de coletor de dados
2. **MarketingOSView**: Violação significativa - frontend mantendo réplicas locais de estado do backend em vez de ser um cliente fino
3. **Vários componentes**: Pequenas vazamentos de lógica de domínio que poderiam ser movidos para o backend (dados derivados, matching simples)
4. **Um componente**: Valor hardcodado que deveria vir do domínio (CheckoutView)

## PRINCÍPIO DE SEPARAÇÃO RECOMENDADO PARA IMPLEMENTAÇÃO FUTURA

```
FRONTEND
=
UI
+
INTERAÇÃO
+
ESTADO DE APRESENTAÇÃO TEMPORÁRIO
+
NAVEGAÇÃO
+
FEEDBACK IMEDIATO AO USUÁRIO

NÃO:
FRONTEND
=
UI
+
BANCO
+
REGRAS DE NEGÓCIO
+
DOMÍNIO
+
PROCESSAMENTO
+
DECISÕES
+
INTEGRAÇÕES
+
PERSISTÊNCIA
```

O frontend deve consumir capacidades do backend de forma clara:
```
Frontend
   ↓
API / RPC / Action
   ↓
Backend / Domain Service
   ↓
Database
```

Em vez de:
```
Frontend
   ↓
Supabase
   ↓
queries complexas
   ↓
regras
   ↓
decisões
```