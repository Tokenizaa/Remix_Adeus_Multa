# ANÁLISE DE UX - FLUXOS CRÍTICOS DO USUÁRIO

Este documento analisa os fluxos críticos do usuário do ponto de vista da experiência (UX), identificando pontos de fricção, etapas desnecessárias e oportunidades de simplificação.

## FLUXO 1: JORNADA DO USUÁRIO PÚBLICO (ANÁLISE GRATUITA DE NOVO CASO)

### ETAPAS ATUAIS
1. Usuário acessa página inicial (/)
2. Clica em "Analisar Minha Multa Gratuitamente"
3. É direto para o wizard de onboarding (/novo-caso) com 11 etapas divididas em 2 fases:
   - Fase 1 (Etapas 1-8): Análise jurídica gratuita
   - Fase 2 (Etapas 9-11): Geração da defesa paga
4. Após completar todas as etapas, pode gerar documento, fazer download ou pagar

### ANÁLISE DE PONTOS DE FRIÇÃO

#### Etapa 1: Seleção do Procedimento
- **Problema:** Pede ao usuário para escolher um tipo de procedimento jurídico antes de qualquer análise
- **Fricção:** Usuário leigo não sabe qual procedimento escolher
- **Oportunidade:** Determinar procedimento recomendado baseado na infração detectada (backend)

#### Etapa 2: Tipo da Infração
- **Problema:** Pede para classificar a infração em categorias (radar, lei seca, celular, etc.)
- **Fricção:** Requer conhecimento jurídico que o usuário não possui
- **Oportunidade:** Extrair automaticamente do número do AIT ou do documento enviado via OCR

#### Etapa 3: Fase Processual
- **Problema:** Pede para informar em que fase processual o caso se encontra
- **Fricção:** Conceito jurídico complexo para usuário leigo
- **Oportunidade:** Determinar automaticamente baseado na data da infração e prazos legais

#### Etapa 4: Dados da Autuação (Fonte da Verdade)
- **Problema:** Solicita múltiplos campos que poderia obter automaticamente:
  - Número do AIT (pode ser extraído de documento via OCR)
  - Data e hora (pode ser extraído de documento)
  - Local (pode ser extraído de documento)
  - Limite de velocidade (pode ser extraído de documento ou inferido de localização)
  - Velocidade medida (pode ser extraída de documento)
  - Velocidade considerada (pode ser calculada)
  - ID do equipamento de radar (pode ser extraído de documento)
  - Data de aferição do INMETRO (deveria vir de consulta a banco de dados público)
  - Data de expedição da notificação (pode ser extraída de documento)
  - Data limite para defesa (deveria ser calculada automaticamente)
  - Vícios formais detectados (deveria ser identificado pelo sistema de análise)

#### Etapa 5: Upload Opcional / Conferência
- **Problema:** Upload tratado como opcional quando deveria ser incentivado como fonte primária de dados
- **Fricção:** Usuário precisa digitar manualmente dados que já estão no documento
- **Oportunidade:** Fazer upload o método primário, com preenchimento manual apenas como fallback

#### Etapa 6: Confirmação dos Dados
- **Problema:** Pede confirmação de dados que o usuário acabou de digitar
- **Fricção:** Redundante se os dados vieram de OCR confiável
- **Oportunidade:** Se OCR for usado, mostrar os dados extraídos para confirmação (uma etapa)

#### Etapa 7: Processamento da Análise
- **Problema:** Etapa de "processamento" que deveria ser transparente
- **Fricção:** Cria expectativa de tempo sem comunicar progresso real
- **Oportunidade:** Mostrar indicadores de progresso reais ou eliminar etapa se processamento for rápido

#### Etapa 8: Diagnóstico Jurídico Concluído
- **Problema:** Apresenta resultado como "concluído" quando na verdade é apenas preliminar
- **Fricção:** Terminologia confusa - não é diagnóstico final
- **Oportunidade:** Chamar de "Análise Preliminar Gratuita" e deixar claro que é apenas o início

#### Etapa 9: Qualificação do Requerente
- **Problema:** Solicita todos os dados do requerente independentemente se o usuário vai pagar
- **Fricção:** Pede informações pessoais sensíveis antes do usuário decidir se quer prosseguir
- **Oportunidade:** Solicitar esses dados APENAS se o usuário optar por gerar a defesa paga

#### Etapa 10: Revisão da Peça Jurídica
- **Problema:** Pede revisão de documento que ainda não foi gerado
- **Fricção:** Etapas fora de ordem lógica
- **Oportunidade:** Esta etapa deveria vir DEPOIS da geração do documento

#### Etapa 11: Emissão da Petição & Pagamento
- **Problema:** Combina pagamento e geração em uma etapa
- **Fricção:** Usuário precisa pagar antes de ver o resultado final
- **Oportunidade:** Permitir visualização do documento gerado antes do pagamento (como já é feito parcialmente na etapa 8)

### PROPOSTA DE UX SIMPLIFICADA

**NOVA JORNADA RECOMENDADA (3 ETAPAS):**

1. **CAPTAÇÃO DE DADOS DO DOCUMENTO**
   - Upload de foto/PDF da notificação de autuação (TENTATIVA PRIMÁRIA)
   - Sistema tenta extrair dados via OCR
   - **SEMPRE** apresentar formulário de preenchimento paralelo para:
     * Número do AIT (obrigatório se OCR falhar ou para confirmação)
     * Placa do veículo (recomendado para melhoria da precisão)
   - Permitir seleção do órgão emissor (DETRAN/agência) para aplicar regras específicas
   - Implementar auto-preenchimento para usuários cadastrados (dados do veículo/requerente)
   - OCR serve como assistente, não como fonte única de verdade devido à variação de documentos entre órgãos

2. **ANÁLISE JURÍDICA GRATUITA**
   - Sistema mostra:
     - Vícios formais detectados no auto
     - Teses de anulabilidade recomendadas com resumos e probabilidades
     - Procedimento sugerido
     - Prazo para defesa
   - Usuário decide se deseja prosseguir para geração da defesa paga

3. **GERAÇÃO DA DEFESA & PAGAMENTO**
   - Se usuário optar por prosseguir:
     - Sistema pede apenas os dados do requerente necessários para o documento (nome, CPF, CNH, endereço)
     - Sistema gera a minuta jurídica completa
     - Usuário revisa e edita se necessário
     - Sistema apresenta valor baseado no tipo de serviço
     - Usuário efetua pagamento (PIX)
     - Sistema libera documento para download e fornece instruções de protocolo

**BENEFÍCIOS DA ABORDAGEM PROPOSTA:**
- Redução de 11 etapas para 3 etapas principais
- Abordagem realista que combina OCR (como assistente) com entrada de dados essenciais (como fonte confiável)
- Eliminação de perguntas que o sistema deveria saber responder
- Coleta de dados apenas quando realmente necessário
- Uso máximo de automação onde confiável (OCR, consultas a bancos públicos, cálculo automático)
- Redução significativa da carga cognitiva sobre o usuário
- Transparência clara sobre o que é gratuito vs pago
- O usuário só fornece o que realmente não pode ser obtido automaticamente
- Resiliência diante da variação de documentos entre diferentes órgãos de trânsito

## FLUXO 2: REVISÃO DE CASO E GERAÇÃO DE DEFESA (USUÁRIO AUTENTICADO)

### ETAPAS ATUAIS (DASHBOARD → DETALHE DO CASO → GERAR DEFESA)
1. Usuário faz login
2. Vê lista de casos no dashboard
3. Clica em um caso para ver detalhes
4. Navega pelas etapas (especialmente Etapa 2: Teses CTB)
5. Seleciona/deseleciona teses jurídicas
6. Clica em "Gerar Minuta"
7. Aguarda processamento
8. Visualiza minuta gerada
9. Opta por baixar PDF ou prosseguir para pagamento

### ANÁLISE DE PONTOS DE FRIÇÃO

#### Etapa de Seleção de Teses
- **Problema:** Apresenta lista técnica de teses que requer conhecimento jurídico para avaliar
- **Fricção:** Usuário precisa entender resumos jurídicos para fazer seleções informadas
- **Oportunidade:** 
  - Agrupar teses por categoria de vício (decadência, nulidade formal, etc.)
  - Forçar seleção mínima de uma tese por categoria crítica
  - Aplicar seleção inteligente padrão baseada em maior probabilidade de sucesso
  - Permitir sobrescrever seleções padrão se usuário desejar

#### Etapa de Geração da Defesa
- **Problema:** Separa visualização e geração em etapas distintas
- **Fricção:** Usuário precisa clicar em botão separado para ver resultado
- **Oportunidade:** 
  - Gerar defesa automaticamente assim como usuário selecionar teses suficientes
  - Ou mostrar preview em tempo real conforme seleções são feitas
  - Manter botão de "regenerar" para quando usuário mudar seleções

### PROPOSTA DE UX SIMPLIFICADA

**FLUXO RECOMENDADO:**
1. Após login, dashboard mostra casos com indicadores visuais claros de status
2. Ao clicar em caso, sistema mostra imediatamente:
   - Resumo do auto (número, placa, infração, órgão, data)
   - Vícios formais detectados (lista simples com ícones de alerta)
   - Análise preliminar: teses recomendadas agrupadas por tipo, com explicação em linguagem simples
   - Botão proeminente: "VER MINUTA COMPLETA" (que gera e mostra a defesa)
3. Ao clicar em "VER MINUTA COMPLETA":
   - Sistema gera minuta usando seleção padrão inteligente (baseada em maiores probabilidades)
   - Mostra minuta pronta para revisão
   - Oferece opções:
     - Editar texto diretamente
     - Ajustar seleção de teses (abre painel lateral com opções)
     - Baixar PDF
     - Prosseguir para pagamento
4. Quando usuário opta por prosseguir para pagamento:
   - Sistema pede APENAS dados do requerente necessários (se ainda não tiver)
   - Mostra valor claro baseado no tipo de serviço
   - Processa pagamento PIX
   - Libera documento final

## FLUXO 3: PAGAMENTO E DOWNLOAD DO DOCUMENTO

### ETAPAS ATUAIS
1. Usuário decide gerar defesa e prossegue para checkout
2. Sistema mostra resumo da defesa e valor fixo de R$ 97,00
3. Usuário preenche dados de pagamento PIX (QR code ou copia e cola)
4. Usuário confirma pagamento (simulado ou real)
5. Sistema redireciona para visualização do caso com documento disponível
6. Usuário pode baixar PDF ou imprimir

### ANÁLISE DE PONTOS DE FRIÇÃO

#### Valor Hardcodado
- **Problema:** Valor fixo de R$ 97,00 independente do tipo de serviço
- **Fricção:** Pode ser enganoso se alguns serviços custarem mais ou menos
- **Oportunidade:** Valor deve ser baseado no tipo de serviço selecionado ou no caso específico

#### Experiência de Pagamento
- **Problema:** Processo de pagamento PIX, embora padrão, poderia ser mais integrado
- **Fricção:** Usuário precisa sair do fluxo mental para lidar com pagamento
- **Oportunidade:** 
  - Manter usuário no mesmo contexto visual durante todo o processo
  - Fornecer instruções claras e visíveis para pagamento PIX
  - Oferecer tanto QR code quanto código copia e cola com destaque igual

#### Transição Pós-Pagamento
- **Problema:** Redirecionamento para tela do caso pode ser confuso
- **Fricção:** Usuário pode não perceber imediatamente que o documento está disponível
- **Oportunidade:** 
  - Tela de confirmação de pagamento mostrar diretamente o documento gerado
  - Opções proeminentes para: visualizar, baixar PDF, imprimir, receber instruções de protocolo

### PROPOSTA DE UX SIMPLIFICADA

**FLUXO RECOMENDADO:**
1. Após usuário optar por gerar defesa, sistema mostra:
   - Resumo claro do que será gerado (tipo de serviço, baseado na análise)
   - Valor exato baseado no serviço (não hardcodado)
   - Botão: "PROSSEGUIR PARA PAGAMENTO"
2. Tela de pagamento:
   - Cabeçalho: "Pagamento Seguro PIX"
   - Instruções claras: "Use o QR code abaixo ou copie o código PIX"
   - Área grande para QR code com legenda: "Aponte a câmera do seu banco"
   - Campo destacado para código copia e cola com botão de cópia ao lado
   - Valor em destaque: "Total a pagar: R$ XX,XX"
   - Botão: "CONFIRMAR PAGAMENTO" (ativa após preenchimento dos campos)
3. Após confirmação de pagamento:
   - Tela de sucesso: "Pagamento Aprovado! Seu documento está pronto."
   - Visualização imediata do documento PDF
   - Botões proeminentes: [BAIXAR PDF] [IMPRIMIR] [VER INSTRUÇÕES DE PROTOCOLO]
   - Lembrete: "Salve este documento e siga as instruções para protocolo no órgão autuador"

## FLUXO 4: GESTÃO DE CASOS (ADMIN)

### ANÁLISE GERAL
O admin apresenta interfaces relativamente adequadas para suas funções de gestão. Os principais pontos de melhoria seriam:

#### Padronização de Ações
- **Oportunidade:** Padronizar ações em linhas de tabela (visualização, edição, exclusão)
- **Benefício:** Reduzir carga cognitiva através de consistência

#### Feedback de Ações
- **Oportunidade:** Fornecer feedback imediato e claro após ações em lote
- **Exemplo:** Após simular pagamentos múltiplos, mostrar resumo: "X pagamentos simulados com sucesso"

#### Visualização de Dados
- **Oportunidade:** Melhorar visualização de datas e status através de:
  - Badges de status com cores consistentes
  - Formatação de datas relativa quando apropriado ("Há 2 horas", "Ontem")
  - Tooltips com informações completas ao passar o mouse

## FLUXO 5: GESTÃO COMERCIAL (ADMIN)

### ANÁLISE GERAL
A interface comercial apresenta boa separação de responsabilidades, com o frontend focado em gestão de UI e o backend lidando com lógica de negócio. Pontos de melhoria menores:

#### Descoberta de Funcionalidades
- **Oportunidade:** Melhorar descubribilidade de funcionalidades relacionadas
- **Exemplo:** Na tela de preços, links claros para: histórico de alterações, auditoria, simulação de impacto

#### Trabalho com Listas
- **Oportunidade:** Melhorar experiência de trabalho em larga escala com:
  - Seleção em lote para operações comuns
  - Filtros salvos e compartilháveis
  - Exportação seletiva de dados

## PRINCÍPIO DE UX RECOMENDADO

**UMA BOA UX DEVE:**
1. **Minimizar entrada do usuário:** Obter o máximo possível de dados automaticamente, mas reconhecer limitações técnicas
2. **Eliminar etapas redundantes:** Cada etapa deve avançar claramente o objetivo do usuário
3. **Usar linguagem do usuário:** Evitar jargões técnicos e jurídicos sempre que possível
4. **Fornecer feedback claro:** Usuário deve sempre saber o que está acontecendo e por quê
5. **Antecipar necessidades:** Oferecer o próximo passo lógico antes que o usuário precise perguntar
6. **Respeitar o contexto:** Manter o usuário no mesmo fluxo mental sempre que possível
7. **Validar somente o essencial:** Verificar apenas o que é absolutamente necessário para prosseguir
8. **Projetar para resiliência:** Quando soluções automatizadas têm limitações conhecidas (como OCR com documentos variados), fornecer métodos de fallback confiáveis sem criar atrito excessivo

**UMA RUIM UX (O QUE EVITAR):**
1. Pedir informações que o sistema já possui ou pode obter automaticamente
2. Apresentar jargões técnicos como se fossem conhecimento comum do usuário
3. Forçar o usuário a tomar decisões que o sistema poderia tomar com base em regras claras
4. Criar etapas que existem apenas por limitações técnicas, não por necessidade do usuário
5. Esconder o progresso real por trás de indicadores genéricos de "processamento"
6. Fazer o usuário retornar ao mesmo ponto repetidamente para completar tarefas relacionadas
7. Usar terminologia interna do sistema na interface com o usuário
8. Depender exclusivamente de soluções automatizadas falhas conhecidas sem oferecer alternativas confiáveis

## RECOMENDAÇÕES FINAIS

1. **IMPLEMENTAR A JORNADA DE 3 ETAPAS** para novos casos públicos, eliminando a necessidade de conhecimento jurídico prévio do usuário
2. **REDUIR O ESTADO FRONTEND NO MARKETINGOSVIEW** para eliminar réplicas de estado do backend
3. **PADRONIZAR COMPONENTES DE LISTAGEM E DETALHE** em todo o admin para consistência
4. **IMPLEMENTAR FEEDBACK VISUAL CLARO** para todas as ações assíncronas (salvamento, processamento, etc.)
5. **OTIMIZAR A COLETA DE DADOS** para obter o máximo possível automaticamente via OCR, consultas a bancos públicos e cálculo automático
6. **GARANTIR QUE O VALOR DO PAGAMENTO SEJA DINÂMICO** baseado no tipo de serviço, não hardcodado
7. **MANTER A CLARIDADE ENTRE O QUE É GRATUITO E O QUE É PAGO** em toda a experiência do usuário