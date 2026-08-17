# PLANO DE REFACTORIAO DO FRONTEND

Este plano estabelece a ordem de execução das refatorações baseada em impacto, risco e dependências.

## PRINCÍPIOS DE PRIORIZAÇÃO

### CRITÉRIOS DE PRIORIDADE
- **P0 (Crítico/Bloqueador):** Problemas que impedem correta separação de responsabilidades ou causam vazamento significativo de lógica de domínio
- **P1 (Alto Impacto):** Problemas que afetam significativamente a manutenibilidade, performance ou clareza da arquitetura
- **P2 (Médio Impacto):** Melhorias de arquitetura que reduziriam complexidade mas não são bloqueadores
- **P3 (Baixo Impacto/Limpeza):** Melhorias de código, padronizações, remoção de duplicações menores

### ORDEM DE EXECUÇÃO
1. **Resolver dependências primeiro:** Corrigir componentes que outros dependem antes de alterá-los
2. **Minimizar riscos:** Começar com mudanças que têm menor possibilidade de regressão
3. **Maximizar impacto:** Abordar primeiro as mudanças que trazem maiores benefícios arquiteturais
4. **Trabalho em faixas:** Quando possível, trabalhar em componentes relacionados em sequência

## PLANO DE EXECUÇÃO

### FASE 1: P0 - CORREÇÕES CRÍTICAS (SEMANAS 1-2)

#### 1.1 OnboardingWizard (/novo-caso) - P0
**Problema:** Violacao severa de separacao de responsabilidades com dados hardcoded extensos
**Impacto:** Alto - componente funcionando como simulador completo em vez de coletor de dados
**Ações:**
- [ ] Manter apenas campos de entrada essenciais que o usuário deve fornecer:
  * Número do AIT (obrigatório para identificar o auto)
  * Placa do veículo (recomendado para melhoria da precisão)
  * Upload de documento (foto/PDF) para tentativa de OCR como assistente
  * Seleção do órgão emissor (DETRAN/agência) para aplicar regras específicas
- [ ] Implementar auto-preenchimento para usuários cadastrados (dados do veículo/requerente históricos)
- [ ] Manter estrutura do wizard mas adaptar para fluxo de 3 etapas proposta na analise de UX
- [ ] Implementar chamada ao backend para processamento:
  * POST `/api/cases` com dados coletados (AIT, placa, upload, órgão)
  * Backend realiza: OCR (se upload fornecido), consultas a bancos públicos, validação, análise jurídica
  * Tratar resposta com análise (vícios, teses recomendadas, procedimento sugerido)
- [ ] Implementar validacoes basicas de frontend (formato de placa, obrigatoriedade do AIT)
- [ ] Manter indicadores de progresso reais durante processamento no backend
- [ ] Preservar funcionalidade existente: fluxo de 2 fases (analise gratuita -> documento pago)

#### 1.2 MarketingOSView (/admin/marketing) - P0
**Problema:** Frontend mantendo replicas locais de estado do backend
**Impacto:** Alto - viola principio de unica fonte de verdade, potencial para inconsistencias
**Ações:**
- [ ] ELIMINAR todas as replicas de estado local:
  * agents state (buscar do backend quando necessario)
  * contents state (buscar do backend quando necessario)
  * metaState state (buscar do backend quando necessario)
  * isPublishing, publishResult (usar apenas estados de UI temporarios)
  * showMetaConnectModal, manualToken (estados de UI temporarios apenas)
- [ ] Manter APENAS estado de UI temporario:
  * Estados de formulario aberto/fechado
  * Estados de carregamento (loading states)
  * Estados de mensagem de feedback (success/error)
  * Estado de visualizacao de conteudo selecionado (temporary)
- [ ] Implementar chamadas ao backend para todas as operacoes:
  * GET `/api/marketing/status` para obter agentes e conteudos
  * GET `/api/meta/status` para obter conectividade Meta
  * POST `/api/marketing/cycle-tick` para executar ciclo
  * POST `/api/marketing/generate-content` para gerar conteudo
  * POST `/api/marketing/publish` para publicar conteudo
  * POST `/api/meta/connect` para conectar Meta
  * POST `/api/meta/disconnect` para desconectar Meta
- [ ] Preservar todas as funcionalidades existentes de gerenciamento de marketing

#### 1.3 CheckoutView (/checkout) - P0
**Problema:** Valor hardcodado do pagamento (97.0)
**Impacto:** Medio - leva a cobranca incorreta se tipos de serviço tiverem precos diferentes
**Acoes:**
- [ ] Obter valor do pagamento do caso (currentCase.payment?.amount) ou servico de precos
- [ ] Nunca assumir valor fixo de pagamento
- [ ] Implementar fallback para valor medio se nao houver definicao especifica
- [ ] Preservar toda funcionalidade de geracao de QR code PIX e simulacao de pagamento

### FASE 2: P1 - ALTO IMPACTO (SEMANAS 3-4)

#### 2.1 AdminCaseDetailView (/admin/cases/:id) - P1
**Problema:** Logica de dominio simples que poderia ser movida para o backend
**Impacto:** Medio-Alto - melhoraria separacao de responsabilidades
**Acoes:**
- [ ] Solicitar ao backend que retorne propriedades derivadas prontas para uso:
  * `isPaidAlready`: boolean simples
  * `hasDefenseDraft`: boolean simples
  * `formattedTheses`: array pronto para exibicao na UI
  * `formattedFormalFlaws`: array pronto para exibicao na UI
  * `autuadorInfo`: objeto com nome, endereco, URL de protocolo fisico e online
- [ ] Adaptar frontend para usar esses dados prontos
- [ ] Manter estado de UI legítimo (abas ativas, modo de edicao, etc.)
- [ ] Manter todas as funcionalidades de visualizacao e interacao

#### 2.2 Componentes de Formulario (Login, Register, etc.) - P1
**Problema:** Validacoes de formulario duplicadas e inconsistentes
**Impacto:** Medio - afeta manutenibilidade e consistencia
**Acoes:**
- [ ] Criar hook customizado `useFormValidation` para validacoes comuns:
  * validacao de email
  * validacao de senha (minimo 6 caracteres)
  * validacao de confirmação de senha
  * validacao de campos obrigatorios
  * validacao de formato de placa (opcional)
- [ ] Refatorar LoginPageView, RegisterPageView e outros forms para usar o hook
- [ ] Manter todas as validacoes existentes e mensagens de erro
- [ ] Permitir sobrescrever validacoes padrao quando necessario

#### 2.3 Componentes de Lista (CasesListView, AdminCasesListView, etc.) - P1
**Problema:** Implementacoes similares de listagem, filtragem e buscado
**Impacto:** Medio - oportunidade de padronizacao e reutilizacao
**Acoes:**
- [ ] Criar componente generico `DataList` com:
  * Campo de busca
  * Filtros de status
  * Renderizacao de linhas personalizavel
  * Estados de carregamento e vazio
  * Paginação (quando necessario)
- [ ] Refatorar CasesListView, AdminCasesListView e outras listas para usar o componente generico
- [ ] Manter todas as funcionalidades existentes de filtragem e buscado
- [ ] Preservar estilos e comportamentos visuais existentes

### FASE 3: P2 - MÉDIO IMPACTO (SEMANAS 5-6)

#### 3.1 Wizard Components (OnboardingWizard steps) - P2
**Problema:** Implementacao customizada de wizard que poderia ser padronizada
**Impacto:** Bajo-Medio - oportunidade de reutilizacao e consistencia
**Acoes:**
- [ ] Avaliar se vale a pena criar componente wizard generico (dado que so temos um uso principal)
- [ ] Se sim, criar componente `Wizard` com:
  * Navegação entre etapas
  * Indicador de progresso
  * Estados de validacao por etapa
  * Callback para conclusao
- [ ] Refatorar OnboardingWizard para usar o componente generico (se criado)
- [ ] Se nao for criado, manter implementacao atual mas melhorar consistencia interna

#### 3.2 Modais e Overlays - P2
**Problema:** Implementacoes similares de modais em varios componentes
**Impacto:** Bajo - oportunidade de padronizacao menor
**Acoes:**
- [ ] Criar componentes genericos de modal:
  * `ModalContainer` para overlay e container
  * `FormModal` para modais com formulario
  * `InfoModal` para modais de informacao
  * `ConfirmationModal` para modais de confirmacao
- [ ] Refatorar modais existentes (edicao de preco, historico, conectar meta, etc.) para usar componentes genericos
- [ ] Manter todas as funcionalidades e estilos existentes

### FASE 4: P3 - LIMPEZA E PADRONIZACAO (SEMANAS 7-8)

#### 3.1 Eliminar Consolde de Codigo - P3
**Problema:** Possiveis comentários TODO, codigo deixado para tras, variaveis nao usadas
**Impacto:** Bajo - melhora legibilidade e manutenibilidade
**Acoes:**
- [ ] Executar auditoria de codigo para identificar:
  * Comentarios TODO/FIXME que podem ser resolvidos ou removidos
  * Variaveis, funcoes, componentes nao usados
  * Codigo comentado que nao serve a nenhum proposito
- [ ] Remover ou resolver itens identificados com cuidado
- [ ] Preservar funcionalidade existente em todos os momentos

#### 3.2 Padronizacao de Tratamento de Erros - P3
**Problema:** Tratamento inconsistente de erros em chamadas de API
**Impacto:** Bajo - afeta experiencia do usuario e depuracao
**Acoes:**
- [ ] Padronizar tratamento de erros comuns:
  * Erros de rede (timeout, falta de conectividade)
  * Erros de autorizacao (401, 403)
  * Erros de validacao (400)
  * Erros de servidor (500+)
- [ ] Criar hook customizado `useApiCall` que encapsule:
  * Estado de carregamento
  * Estado de sucesso/erro
  * Funcao de chamada com tratamento padronizado de erros
  * Retry opcional
- [ ] Refatorar chamadas de API existentes para usar o padrao
- [ ] Manter todas as funcionalidades existentes de tratamento de erro especializado

#### 3.3 Documentacao e Comentarios - P3
**Problema:** Documentacao inconsistente e ausente em alguns componentes
**Impacto:** Bajo - afeta onboarding e manutenibilidade
**Acoes:**
- [ ] Adicionar comentarios JSDoc a todos os componentes, hooks e funcoes publicas
- [ ] Documentar props obrigatorias e opcionais
- [ ] Documentar valores de retorno e possiveis erros
- [ ] Manter comentarios existentes que sejam uteis
- [ ] Remover comentarios enganosos ou desatualizados

## CRONOGRAMA ESTIMADO

| Fase | Semanas | Foco Principal |
|------|---------|----------------|
| 1    | 1-2     | Correcoes criticas (OnboardingWizard, MarketingOSView, CheckoutView) |
| 2    | 3-4     | Alto impacto (AdminCaseDetailView, form components, list components) |
| 3    | 5-6     | Medio impacto (wizard components, modais, overlays) |
| 4    | 7-8     | Limpeza e padronizacao (eliminacao de lixo, padronizacao de erros, documentacao) |

## METRICAS DE SUCESSO

Para cada componente refatorado, verificar:
1. [ ] Todas as funcionalidades existentes preservadas
2. [ ] Nenhuma regressao introduzida (testes manuais ou automatizados)
3. [ ] Separacao de responsabilidades melhorada conforme mapeamento
4. [ ] Complexidade reduzida (medivel por linhas de codigo, numero de estados, etc.)
5. [ ] Experiencia do usuario mantida ou melhorada
6. [ ] Codigos seguindo padroes estabelecidos (se aplicavel)

## PLANO DE TESTE E VALIDACAO

### TESTE DE FUNCIONALIDADE
- [ ] Testar todos os fluxos de usuario criticos apos cada fase
- [ ] Verificar que nenhum recurso existente foi quebrado
- [ ] Confirmar que novas implementacoes funcionam como esperado

### TESTE DE SEPARACAO DE RESPONSABILIDADES
- [ ] Verificar que componentes nao acessam diretamente banco de dados ou fazem logica de dominio complexa
- [ ] Confirmar que chamadas ao backend sao feitas apenas para operacoes necessarias
- [ ] Validar que estado do frontend e limitado a UI temporaria e estado de apresentacao

### TESTE DE PERFORMANCE
- [ ] Medir tempo de carregamento inicial de componentes criticos
- [ ] Verificar que mudancas nao introduziram atrasos significativos
- [ ] Confirmar que utilizacao de memoria é adequada

### REVISAO DE CODIGO
- [ ] Revisao por pares para todas as alteracoes
- [ ] Validar adesao aos principios de separacao de responsabilidades
- [ ] Confirmar que nenhuma funcionalidade foi perdida ou degradada