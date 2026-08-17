# LISTA SIMPLIFICADA: O QUE FICA NO FRONTEND VS O QUE SAI PARA O BACKEND

Esta lista direta e objetiva mostra exatamente quais páginas e componentes devem permanecer no frontend (com apenas responsabilidades de UI) e quais devem ter sua lógica movida para o backend.

## ✅ PÁGINAS/COMPONENTES QUE PERMANECEM NO FRONTEND (APENAS UI/INTERAÇÃO)
Estes componentes devem manter basicamente sua estrutura atual, focando exclusivamente em:
- Apresentação (layout, botões, formulários, tabelas)
- Estado de UI temporário (abas, modais, loading states)
- Interação básica (cliques, input, navegação)
- Chamadas simples ao backend para buscar/enviar dados
- Nenhuma lógica de negócio, processamento de dados ou decisões

### PÁGINAS PÚBLICAS
1. **LandingPageView.tsx** - Apresentação estática, navegação
2. **LoginPageView.tsx** - Formulário de login (validações básicas obrigatórias/email)
3. **RegisterPageView.tsx** - Formulário de registro (validações básicas obrigatórias/email/senha)
4. **CheckoutView.tsx** - Apenas coleta de dados de pagamento e exibição QR code (valor deve vir do backend)

### PÁGINAS DE USUÁRIO
5. **UserDashboardView.tsx** - Apresentação de dados recebidos como props (métricas simples, listas)
6. **CasesListView.tsx** - Lista de casos com busca/filtragem simples (estado de UI apenas)
7. **CaseDetailView.tsx** - Abas de apresentação, estado de UI (modo edição, aba ativa)
8. **UserProfileView.tsx** - Formulário de edição de perfil (validações básicas)
9. **UserSettingsView.tsx** - Apresentação de configurações, formulário simples

### PÁGINAS ADMIN (APÓS SIMPLIFICAÇÃO)
10. **AdminDashboardView.tsx** - Apresentação de métricas recebidas do backend
11. **AdminCasesListView.tsx** - Lista de casos com busca/filtragem simples (estado de UI)
12. **AdminCaseDetailView.tsx** - Apenas abas de apresentação + estado de UI (nenhuma lógica de domínio)
13. **AdminUsersListView.tsx** - Lista de usuários com busca/filtragem simples
14. **AdminUserDetailView.tsx** - Formulário de edição + apresentação (validações básicas)
15. **AdminPaymentsView.tsx** - Lista de pagamentos + filtros simples
16. **AdminLogsView.tsx** - Lista de logs + busca simples
17. **AdminSettingsView.tsx** - Formulário de configuração (validações básicas)
18. **AdminDocumentsView.tsx** - Lista de documentos + visualização
19. **AdminIntegrationsView.tsx** - Status de integrações (apenas apresentação do que backend envia)
20. **AdminMonitoringView.tsx** - Métricas de sistema (apresentação do que backend envia)
21. **AdminAiGatewayView.tsx** - Apresentação de dados de IA recebidos do backend
22. **AdminCommercial*PricesView.tsx** e similares - Apresentação de dados comerciais + formulários simples (validações básicas)

### COMPONENTES COMUNS/LAYOUT
23. **Header.tsx, Footer.tsx, Layouts, Sidebars** - Navegação e estrutura visual pura
24. **GovBr components** (CookieBanner, Header, Footer, AccessibilityBar) - Componentes de UI governamental
25. **Modais simples** (LogDetailModal, SecretEditModal) - Apenas apresentação + estado de UI

### PÁGINAS DE CONHECIMENTO/OUTROS
26. **KnowledgeBaseView.tsx** - Busca/apresentação de artigos (estado de UI de busca apenas)
27. **DocumentBlocksView.tsx** - Visualização/edição de blocos (estado de UI apenas)
28. **AuditLogsView.tsx** - Lista de logs de auditoria (busca/apresentação simples)
29. **WhatsAppSimulatorModal.tsx** - Simulador de UI (estado de UI apenas)

## 🚫 PÁGINAS/COMPONENTES QUE PRECISAM TER LÓGICA MOVIDA PARA O BACKEND
Estes componentes atualmente violam a separação de responsabilidades e precisam ter sua lógica de negócio, estado replicado ou processamento de dados movido para o backend. Após a refatoração, eles permanecerão no frontend mas apenas como "clientes finos".

### 1. ONBOARDING WIZARD (MAIOR PROBLEMA)
**ARQUIVOS:** 
- `src/components/onboarding/OnboardingWizard.tsx`
- Todos os steps em `src/components/onboarding/steps/`

**O QUE SAI PARA O BACKEND:**
- ❌ TODO o processamento jurídico (análise de vícios, geração de teses)
- ❌ Dados hardcoded de veículos, infrações, requerentes
- ❌ Lógica de determinação de procedimento/fase processual
- ❌ Geração de análise jurídica completa
- ❌ Qualquer coisa que não seja coleta básica de dados do usuário

**O QUE FICA NO FRONTEND (APOS REFACTORIAO):**
- ✅ Apenas coleta de dados essenciais:
  * Número do AIT (obrigatório)
  * Placa do veículo (recomendado)
  * Upload de documento (para OCR como assistente)
  * Seleção do órgão emissor
- ✅ Estado de UI do wizard (passo atual, validação de formulário)
- ✅ Mensagens de loading/erro/sucesso do backend
- ✅ Navegação entre steps
- ✅ Auto-preenchimento para usuários cadastrados

### 2. MARKETING OS VIEW (PROBLEMA CRÍTICO DE ESTADO)
**ARQUIVO:**
- `src/components/marketing/MarketingOSView.tsx`

**O QUE SAI PARA O BACKEND:**
- ❌ Estado local réplica dos 7 agentes de marketing
- ❌ Estado local réplica dos conteúdos editoriais
- ❌ Estado local réplica da conexão Meta
- ❌ Lógica de ciclo de marketing, geração de conteúdo, publicação
- ❌ Qualquer processamento de dados de marketing

**O QUE FICA NO FRONTEND (APOS REFACTORIAO):**
- ✅ Apenas estado de UI temporário:
  * Se o formulário de conexão Meta está aberto
  * Estado de carregamento durante ações
  * Mensagens de sucesso/erro para mostrar
  * Qual conteúdo/agente está sendo visualizado no momento
- ✅ Botões para acionar ações no backend:
  * Conectar/desconectar Meta
  * Iniciar ciclo de marketing
  * Gerar conteúdo
  * Publicar conteúdo
- ✅ Apresentação dos dados que o backend envia via APIs simples:
  * GET `/api/marketing/status` → mostra agentes, conteúdos, status Meta
  * POST `/api/marketing/cycle-tick` → executa ciclo
  * etc.

### 3. ADMIN CASE DETAIL VIEW (LÓGICA DE DOMÍNIO DESNECESSÁRIA)
**ARQUIVO:**
- `src/components/admin/AdminCaseDetailView.tsx`

**O QUE SAI PARA O BACKEND:**
- ❌ Lógica para determinar se está pago (verificando múltiplas fontes)
- ❌ Extração de teses e vícios formais para exibição
- ❌ Matching de texto para encontrar informações do órgão autuador
- ❌ Qualquer processamento simples de dados que poderia ser feito no backend

**O QUE FICA NO FRONTEND (APOS REFACTORIAO):**
- ✅ Apenas estado de UI:
  * Aba atualmente ativa (detalhes, teses, vícios, pagamento, etc.)
  * Modo de edição ativado/desativado
  * Estados de carregamento
  * Mensagens de feedback
- ✅ Presentacão dos dados PREPROCESSADOS que o backend envia:
  * `isPaidAlready` (boolean simples)
  * `hasDefenseDraft` (boolean simples)
  * `formattedTheses` (array pronto para UI)
  * `formattedFormalFlaws` (array pronto para UI)
  * `autuadorInfo` (objeto com nome, endereço, URLs)
- ✅ Interacões do usuário (navegação entre abas, edição de campos que vão para backend)

## 📊 RESUMO VISUAL DO QUE MUDA

### ANTES (Poluição):
```
Frontend
├── Estado de negócio replicado (agents, contents, metaState)
├── Lógica de domínio (cálculos, decisões, processamento)
├── Dados hardcoded/mock
├── Integrações diretas (banco, serviços externos)
└── Alguma UI/Interacão
```

### DEPOIS (Limpo):
```
Frontend
├── Estado de UI temporário (abas, modais, loading, mensagens)
├── Apresentação de dados recebidos do backend
├── Interacão básica com usuário (cliques, input, navegação)
├── Chamadas simples ao backend (GET/POST para dados/comandos)
└── ZERO estado de negócio replicado
ZERO lógica de domínio
ZERO integrações diretas
ZERO dados hardcoded/mock
```

## ⏳ ORDEM DE IMPLEMENTAÇÃO (REFACTORIAO)

### FASE 1 - IMEDIATA (Alto impacto, baixa risco)
1. **MarketingOSView** - Remover TODO estado local de negócio, deixar apenas UI + chamadas API
2. **OnboardingWizard** - Refatorar para coletar apenas dados essenciais + delegar processamento ao backend

### FASE 2 - CURTO PRAZO (Impacto médio)
3. **AdminCaseDetailView** - Solicitar backend para retornar dados prontos, usar apenas para apresentacão
4. **Componentes de lista** - Padronizar com componente generico `DataList` para reduzir duplicação

### FASE 3 - LONGO PRAZO (Refinamento)
5. **Modais e formulários** - Criar componentes genericos reutilizáveis
6. **Padronização geral** - Tratamento de erros, loading states, documentação

## 🎯 RESULTADO ESPERADO

Após a refatoração:
- **Frontend admin** será 70-80% menos complexo
- **Zero inconsistências** entre estado frontend e backend
- **Manutenibilidade** muito melhorada (cada componente tem responsabilidade única)
- **Performance** melhorada (menos processamento desnecessário no cliente)
- **Escalabilidade** aprimorada (lógica de negócio centralizada no backend pode ser otimizada independentemente)
- **Experiência do usuário** mais limpa e confiável (menos elementos confusos, feedback mais claro)

**Princípio final:** O frontend admin deve ser apenas uma janela inteligente que mostra exatamente o que o backend envia e coleta apenas o que o usuário coloca - nada mais, nada menos.