# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: onboarding-flow.spec.ts >> Document Validation - Art. 281-A Corrections >> Verify Art. 281-A replaces old Art. 281-II
- Location: tests/e2e/onboarding-flow.spec.ts:192:3

# Error details

```
Error: page.click: Target page, context or browser has been closed
Call log:
  - waiting for locator('text=Radar / Medidor de Velocidade')

```

# Test source

```ts
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
  138 |     await page.click('button:has-text("Prosseguir para Pagamento")');
  139 |     await expect(page.locator('text=Emissão da Petição')).toBeVisible({ timeout: 5000 });
  140 |   });
  141 | 
  142 |   test('Step 11: Document Checkout - Generate and Verify PDF', async () => {
  143 |     await expect(page.locator('text=Emissão da Petição')).toBeVisible();
  144 |     
  145 |     // Click to generate PDF/Print
  146 |     await page.click('button:has-text("Gerar PDF")');
  147 |     
  148 |     // Wait for new tab/window with PDF
  149 |     const [pdfPage] = await Promise.all([
  150 |       page.waitForEvent('popup'),
  151 |       page.click('button:has-text("Imprimir / Salvar PDF")'),
  152 |     ]);
  153 |     
  154 |     await pdfPage.waitForLoadState('networkidle');
  155 |     
  156 |     // Get PDF content
  157 |     const pdfText = await pdfPage.textContent();
  158 |     
  159 |     // Verify critical elements in PDF
  160 |     expect(pdfText).toContain('Art. 281-A');
  161 |     expect(pdfText).toContain('Decadência da Notificação de Autuação');
  162 |     expect(pdfText).toContain('Lei 14.071/2020');
  163 |     expect(pdfText).toContain('Súmula 312');
  164 |     expect(pdfText).toContain('Aferição Metrológica');
  165 |     expect(pdfText).toContain('Resolução CONTRAN');
  166 |     expect(pdfText).toContain('INMETRO');
  167 |     expect(pdfText).toContain('1B892014'); // AIT number
  168 |     expect(pdfText).toContain('BRA2E19'); // Plate
  169 |     expect(pdfText).toContain('Carlos Eduardo Silveira'); // Applicant name
  170 |     expect(pdfText).toContain('123.456.789-00'); // CPF
  171 |     
  172 |     // Verify temporal application - correct law version
  173 |     expect(pdfText).toContain('2025');
  174 |     
  175 |     await pdfPage.close();
  176 |   });
  177 | });
  178 | 
  179 | test.describe('Document Validation - Art. 281-A Corrections', () => {
  180 |   let page: Page;
  181 | 
  182 |   test.beforeAll(async ({ browser }) => {
  183 |     page = await browser.newPage();
  184 |     await page.goto(BASE_URL);
  185 |     await page.waitForLoadState('networkidle');
  186 |   });
  187 | 
  188 |   test.afterAll(async () => {
  189 |     await page.close();
  190 |   });
  191 | 
  192 |   test('Verify Art. 281-A replaces old Art. 281-II', async () => {
  193 |     // Navigate through to step 8 quickly with pre-filled data
  194 |     await page.click('text=Defesa Prévia');
> 195 |     await page.click('text=Radar / Medidor de Velocidade');
      |                ^ Error: page.click: Target page, context or browser has been closed
  196 |     await page.click('text=Defesa Prévia (Notificação de Autuação)');
  197 |     
  198 |     // Wait for step 4
  199 |     await page.waitForSelector('text=Dados da Autuação');
  200 |     
  201 |     // Quick fill
  202 |     await page.fill('input[name="aitNumber"]', '1B892014');
  203 |     await page.fill('input[name="infractionCode"]', '745-50');
  204 |     await page.fill('input[name="dateTime"]', '2025-01-15 10:30');
  205 |     await page.fill('input[name="notificationExpeditionDate"]', '2025-02-20'); // >30 days after infraction
  206 |     await page.fill('input[name="defenseDeadline"]', '2025-03-20');
  207 |     
  208 |     await page.click('button:has-text("Próximo")');
  209 |     await page.click('button:has-text("Pular")');
  210 |     await page.click('button:has-text("Confirmar e Executar Análise")');
  211 |     
  212 |     await page.waitForSelector('text=Diagnóstico Jurídico Concluído', { timeout: 30000 });
  213 |     
  214 |     // Verify Art. 281-A is present, NOT Art. 281-II
  215 |     const content = await page.textContent('main');
  216 |     expect(content).toContain('Art. 281-A');
  217 |     expect(content).not.toContain('Art. 281, II');
  218 |     expect(content).not.toContain('Art. 281-II');
  219 |     expect(content).not.toContain('Art. 281 II');
  220 |   });
  221 | 
  222 |   test('Verify official sources and temporal application in analysis', async () => {
  223 |     const content = await page.textContent('main');
  224 |     
  225 |     // Official sources
  226 |     expect(content).toContain('Lei 14.071/2020');
  227 |     expect(content).toContain('Código de Trânsito Brasileiro');
  228 |     expect(content).toContain('CONTRAN');
  229 |     expect(content).toContain('INMETRO');
  230 |     expect(content).toContain('Súmula 312');
  231 |     expect(content).toContain('STJ');
  232 |     
  233 |     // Temporal application - Lei 14.071/2020 applied
  234 |     expect(content).toContain('2020');
  235 |   });
  236 | });
```