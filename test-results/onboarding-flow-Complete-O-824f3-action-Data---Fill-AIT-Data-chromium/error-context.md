# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: onboarding-flow.spec.ts >> Complete Onboarding Flow - 11 Steps >> Step 4: Infraction Data - Fill AIT Data
- Location: tests/e2e/onboarding-flow.spec.ts:36:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Dados da Autuação')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('text=Dados da Autuação')

```

```yaml
- link "Ir para o conteúdo 1":
  - /url: "#main-content"
- link "Ir para o menu 2":
  - /url: "#main-menu"
- link "Ir para a busca 3":
  - /url: "#main-search"
- link "Ir para o rodapé 4":
  - /url: "#footer"
- button "Diminuir tamanho da fonte": A-
- button "Redefinir tamanho da fonte": A
- button "Aumentar tamanho da fonte": A+
- button "Alternar modo de alto contraste": Alto Contraste
- banner:
  - text: DEFESAI Sistema de Defesa Autônoma
  - link "Página Inicial":
    - /url: /
  - link "Análise Gratuita":
    - /url: /novo-caso
  - link "Base Jurídica":
    - /url: /knowledge
  - button "Abrir menu de navegação"
  - text: Defe s Ai
  - heading "Adeus Multa CTB • CONTRAN" [level=1]
  - paragraph: Plataforma de Defesa Autônoma para Multas de Trânsito
  - textbox "Buscar serviços ou infrações..."
  - button "Executar busca"
  - button "Análise Gratuita"
  - button "D Acessar Conta"
- main:
  - text: MOTOR DE INTELIGÊNCIA JURÍDICA CTB & CONTRAN
  - heading "Descubra se o seu auto de infração de trânsito possui vícios formais de anulação." [level=1]
  - paragraph: Diagnóstico preliminar gratuito fundamentado nas resoluções vigentes do CONTRAN, prazos decadenciais do Art. 281 do CTB e jurisprudência dos tribunais superiores.
  - button "Analisar Minha Multa Gratuitamente"
  - button "Acessar com gov.br"
  - text: Diagnóstico Preliminar em 30 segundos 52 teses jurídicas canônicas 100% determinístico e auditável FLUXO TRANSPARENTE E ACESSÍVEL
  - heading "Como funciona a análise e defesa de trânsito" [level=2]
  - paragraph: A primeira fase é 100% gratuita para identificação de teses. A segunda fase gera a petição formal com todos os requisitos legais.
  - text: "01"
  - heading "Informe os Dados da Infração" [level=3]
  - paragraph: Digite o número do auto (AIT), código do enquadramento ou envie a foto da notificação para auxílio de preenchimento.
  - text: "02"
  - heading "Diagnóstico Jurídico Gratuito" [level=3]
  - paragraph: O sistema cruza as informações com o CTB, resoluções do CONTRAN e normas do INMETRO, calculando a probabilidade real de êxito.
  - text: "03"
  - heading "Geração da Petição Formal" [level=3]
  - paragraph: Ao optar pela emissão, receba a minuta completa diagramada no padrão oficial em A4 com passo a passo para protocolo no órgão autuador.
  - text: BASE JURÍDICA ESTRUTURADA
  - heading "Principais Teses de Anulação no Sistema de Trânsito" [level=2]
  - paragraph: Fundamentos previstos expressamente na Lei Federal nº 9.503/1997 e Resoluções Normativas do CONTRAN.
  - text: Art. 281 do CTB
  - heading "Decadência de Notificação de Autuação" [level=4]
  - paragraph: Expedição da notificação que ultrapassa 30 dias contados da data da infração enseja o arquivamento sumário do auto.
  - text: Resolução 798 CONTRAN
  - heading "Aferição Metrológica do Radar" [level=4]
  - paragraph: Medidores eletrônicos de velocidade exigem verificação anual obrigatória pelo INMETRO para validade do registro.
  - text: Art. 267 do CTB
  - heading "Conversão em Advertência por Escrito" [level=4]
  - paragraph: Direito subjetivo do condutor sem reincidência nos últimos 12 meses em infrações leves ou médias (Lei 14.071/20).
  - text: Resolução 909 CONTRAN
  - heading "Sinalização de Videomonitoramento" [level=4]
  - paragraph: Autuações por câmeras exigem placa informativa de fiscalização ostensiva na via sob pena de nulidade material.
  - text: Súmula 312 do STJ
  - heading "Garantia da Dupla Notificação" [level=4]
  - paragraph: Obrigatória a expedição individualizada da Notificação de Autuação (NA) e da Notificação de Imposição de Penalidade (NIP).
  - text: Resolução 432 CONTRAN
  - heading "Margem de Erro do Etilômetro" [level=4]
  - paragraph: Observância estrita da tabela de erro máximo admissível e termos de constatação regulamentares.
  - text: PERGUNTAS FREQUENTES
  - heading "Tire suas dúvidas sobre o processo" [level=2]
  - heading "A análise preliminar é realmente gratuita?" [level=4]
  - paragraph: Sim, 100% gratuita. Você descobre as teses aplicáveis, probabilidade de êxito e prazos sem pagar nada e sem precisar informar dados bancários.
  - heading "O que acontece após protocolar a defesa?" [level=4]
  - paragraph: A defesa tempestiva suspende a exigibilidade da multa e os pontos na CNH até o julgamento pelo órgão autuador ou pela JARI.
  - heading "Posso protocolar a defesa pela internet?" [level=4]
  - paragraph: Sim. A petição gerada pelo DefesAi segue a estrutura formal exigida para protocolo presencial, envio postal ou protocolo digital nos portais do DETRAN, PRF, DNIT e prefeituras municipais.
- contentinfo:
  - text: Defe s Ai | Adeus Multa
  - paragraph: Plataforma de inteligência jurídica para geração determinística de defesas e recursos de trânsito em conformidade com o Código de Trânsito Brasileiro (CTB) e Resoluções do CONTRAN.
  - text: Sistema de Defesa Autônoma
  - heading "Serviços ao Usuário" [level=3]
  - list:
    - listitem:
      - button "Análise Preliminar Gratuita de Multa"
    - listitem:
      - button "Defesa Prévia (Notificação de Autuação)"
    - listitem:
      - button "Recurso à JARI (1ª Instância)"
    - listitem:
      - button "Recurso ao CETRAN (2ª Instância)"
    - listitem:
      - button "Conversão em Advertência (Art. 267 CTB)"
  - heading "Legislação & Normas" [level=3]
  - list:
    - listitem:
      - link "Lei nº 9.503/1997 (CTB)":
        - /url: https://www.planalto.gov.br/ccivil_03/leis/l9503compilado.htm
    - listitem: Resoluções CONTRAN (798, 909, 918)
    - listitem: Súmula 312 do STJ (Notificação Dupla)
    - listitem: Tema 1.097 do STJ
    - listitem:
      - link "SENATRAN — Secretaria Nacional":
        - /url: https://www.gov.br/transportes/pt-br/assuntos/transito/senatran
  - heading "Acessibilidade & LGPD" [level=3]
  - paragraph: Tratamento de dados realizado estritamente segundo as diretrizes da Lei nº 13.709/2018 (LGPD), garantindo sigilo e minimização de coleta.
  - text: Criptografia de Ponta a Ponta
  - paragraph: Em conformidade com o eMAG e WCAG 2.1 / 2.2 AA.
  - text: BRASIL
  - paragraph: © 2026 DefesAi • Tecnologia Jurídica Autônoma • Todos os direitos reservados.
  - text: Padrão DefesAi • Versão 1.0.0
- region "Aviso de Privacidade e Cookies":
  - heading "Privacidade e Proteção de Dados (LGPD — Lei nº 13.709/2018)" [level=4]
  - paragraph: Utilizamos cookies e tecnologias similares estritamente essenciais para garantir a segurança da sessão, acessibilidade e a correta geração das defesas de trânsito.
  - button "Apenas Necessários"
  - button "Aceitar e Continuar"
```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | const BASE_URL = 'http://localhost:8080';
  4   | 
  5   | test.describe('Complete Onboarding Flow - 11 Steps', () => {
  6   |   let page: Page;
  7   | 
  8   |   test.beforeAll(async ({ browser }) => {
  9   |     page = await browser.newPage();
  10  |     await page.goto(BASE_URL);
  11  |     await page.waitForLoadState('networkidle');
  12  |   });
  13  | 
  14  |   test.afterAll(async () => {
  15  |     await page.close();
  16  |   });
  17  | 
  18  |   test('Step 1: Service Selection - Defesa Prévia', async () => {
  19  |     await expect(page.locator('text=Seleção do Procedimento')).toBeVisible();
  20  |     await page.click('text=Defesa Prévia');
  21  |     await expect(page.locator('text=Tipo da Infração')).toBeVisible({ timeout: 5000 });
  22  |   });
  23  | 
  24  |   test('Step 2: Infraction Type - Radar', async () => {
  25  |     await expect(page.locator('text=Tipo da Infração')).toBeVisible();
  26  |     await page.click('text=Radar / Medidor de Velocidade');
  27  |     await expect(page.locator('text=Fase Processual')).toBeVisible({ timeout: 5000 });
  28  |   });
  29  | 
  30  |   test('Step 3: Defense Stage - Defesa Prévia', async () => {
  31  |     await expect(page.locator('text=Fase Processual')).toBeVisible();
  32  |     await page.click('text=Defesa Prévia (Notificação de Autuação)');
  33  |     await expect(page.locator('text=Dados da Autuação')).toBeVisible({ timeout: 5000 });
  34  |   });
  35  | 
  36  |   test('Step 4: Infraction Data - Fill AIT Data', async () => {
> 37  |     await expect(page.locator('text=Dados da Autuação')).toBeVisible();
      |                                                          ^ Error: expect(locator).toBeVisible() failed
  38  |     
  39  |     // Fill AIT number
  40  |     await page.fill('input[name="aitNumber"]', '1B892014');
  41  |     await page.fill('input[name="infractionCode"]', '745-50');
  42  |     await page.fill('input[name="description"]', 'Transitar em velocidade superior à máxima permitida em até 20%');
  43  |     await page.fill('input[name="ctbArticle"]', 'Art. 218, I do CTB');
  44  |     await page.fill('input[name="dateTime"]', '2025-01-15 10:30');
  45  |     await page.fill('input[name="location"]', 'Av. das Nações Unidas, alt. 14.401 — São Paulo/SP');
  46  |     await page.fill('input[name="speedLimit"]', '60');
  47  |     await page.fill('input[name="measuredSpeed"]', '71');
  48  |     await page.fill('input[name="consideredSpeed"]', '64');
  49  |     await page.fill('input[name="radarEquipmentId"]', 'RAD-INMETRO-7819');
  50  |     await page.fill('input[name="inmetroAferitionDate"]', '2024-04-12');
  51  |     await page.fill('input[name="notificationExpeditionDate"]', '2025-01-20');
  52  |     await page.fill('input[name="defenseDeadline"]', '2025-02-19');
  53  |     
  54  |     // Vehicle data
  55  |     await page.fill('input[name="plate"]', 'BRA2E19');
  56  |     await page.fill('input[name="brandModel"]', 'Toyota Corolla Cross XRE');
  57  |     await page.fill('input[name="renavam"]', '00123984712');
  58  |     await page.fill('input[name="year"]', '2024');
  59  |     await page.fill('input[name="color"]', 'Preto');
  60  |     
  61  |     await page.click('button:has-text("Próximo")');
  62  |     await expect(page.locator('text=Upload Opcional')).toBeVisible({ timeout: 5000 });
  63  |   });
  64  | 
  65  |   test('Step 5: Document Upload (Optional) - Skip', async () => {
  66  |     await expect(page.locator('text=Upload Opcional')).toBeVisible();
  67  |     await page.click('button:has-text("Pular")');
  68  |     await expect(page.locator('text=Confirmação dos Dados')).toBeVisible({ timeout: 5000 });
  69  |   });
  70  | 
  71  |   test('Step 6: Data Confirmation - Confirm and Run Analysis', async () => {
  72  |     await expect(page.locator('text=Confirmação dos Dados')).toBeVisible();
  73  |     await page.click('button:has-text("Confirmar e Executar Análise")');
  74  |     await expect(page.locator('text=Processamento da Análise')).toBeVisible({ timeout: 5000 });
  75  |   });
  76  | 
  77  |   test('Step 7: Analysis Processing - Wait for Completion', async () => {
  78  |     await expect(page.locator('text=Processamento da Análise')).toBeVisible();
  79  |     // Wait for analysis to complete (up to 30 seconds)
  80  |     await page.waitForSelector('text=Diagnóstico Jurídico Concluído', { timeout: 30000 });
  81  |   });
  82  | 
  83  |   test('Step 8: Free Analysis Result - Verify Art. 281-A Present', async () => {
  84  |     await expect(page.locator('text=Diagnóstico Jurídico Concluído')).toBeVisible();
  85  |     
  86  |     // Check for Art. 281-A in the analysis results
  87  |     await expect(page.locator('text=Art. 281-A')).toBeVisible();
  88  |     await expect(page.locator('text=Decadência da Notificação de Autuação')).toBeVisible();
  89  |     await expect(page.locator('text=96%')).toBeVisible(); // Success probability
  90  |     
  91  |     // Check other arguments present
  92  |     await expect(page.locator('text=Aferição Metrológica do Radar')).toBeVisible();
  93  |     await expect(page.locator('text=Conversão em Advertência')).toBeVisible();
  94  |     
  95  |     await page.click('button:has-text("Gerar Defesa Completa")');
  96  |     await expect(page.locator('text=Qualificação do Requerente')).toBeVisible({ timeout: 5000 });
  97  |   });
  98  | 
  99  |   test('Step 9: Required Data - Fill Applicant Data', async () => {
  100 |     await expect(page.locator('text=Qualificação do Requerente')).toBeVisible();
  101 |     
  102 |     await page.fill('input[name="applicantName"]', 'Carlos Eduardo Silveira');
  103 |     await page.fill('input[name="applicantCpf"]', '123.456.789-00');
  104 |     await page.fill('input[name="applicantRg"]', '12.345.678-9 SSP/SP');
  105 |     await page.fill('input[name="applicantCnh"]', '05492817492');
  106 |     await page.fill('input[name="cnhCategory"]', 'AB');
  107 |     await page.fill('input[name="applicantPhone"]', '(11) 98765-4321');
  108 |     await page.fill('input[name="applicantEmail"]', 'carlos.silveira@email.com');
  109 |     await page.fill('input[name="addressStreet"]', 'Rua das Flores');
  110 |     await page.fill('input[name="addressNumber"]', '450');
  111 |     await page.fill('input[name="addressComplement"]', 'Apto 82');
  112 |     await page.fill('input[name="addressNeighborhood"]', 'Vila Madalena');
  113 |     await page.fill('input[name="addressZipCode"]', '05445-010');
  114 |     await page.fill('input[name="addressCityState"]', 'São Paulo/SP');
  115 |     
  116 |     await page.click('button:has-text("Próximo")');
  117 |     await expect(page.locator('text=Revisão da Peça Jurídica')).toBeVisible({ timeout: 5000 });
  118 |   });
  119 | 
  120 |   test('Step 10: Document Review - Verify Generated Content', async () => {
  121 |     await expect(page.locator('text=Revisão da Peça Jurídica')).toBeVisible();
  122 |     
  123 |     // Verify key legal references in the document
  124 |     const docContent = await page.locator('main').textContent();
  125 |     
  126 |     // Check Art. 281-A is present
  127 |     expect(docContent).toContain('Art. 281-A');
  128 |     
  129 |     // Check official sources are referenced
  130 |     expect(docContent).toContain('Lei 14.071/2020');
  131 |     expect(docContent).toContain('Súmula 312');
  132 |     expect(docContent).toContain('CONTRAN');
  133 |     expect(docContent).toContain('INMETRO');
  134 |     
  135 |     // Check temporal application
  136 |     expect(docContent).toContain('2025'); // Year of infraction
  137 |     
```