import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:8080';

test.describe('Complete Onboarding Flow - 11 Steps', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Step 1: Service Selection - Defesa Prévia', async () => {
    await expect(page.locator('text=Seleção do Procedimento')).toBeVisible();
    await page.click('text=Defesa Prévia');
    await expect(page.locator('text=Tipo da Infração')).toBeVisible({ timeout: 5000 });
  });

  test('Step 2: Infraction Type - Radar', async () => {
    await expect(page.locator('text=Tipo da Infração')).toBeVisible();
    await page.click('text=Radar / Medidor de Velocidade');
    await expect(page.locator('text=Fase Processual')).toBeVisible({ timeout: 5000 });
  });

  test('Step 3: Defense Stage - Defesa Prévia', async () => {
    await expect(page.locator('text=Fase Processual')).toBeVisible();
    await page.click('text=Defesa Prévia (Notificação de Autuação)');
    await expect(page.locator('text=Dados da Autuação')).toBeVisible({ timeout: 5000 });
  });

  test('Step 4: Infraction Data - Fill AIT Data', async () => {
    await expect(page.locator('text=Dados da Autuação')).toBeVisible();
    
    // Fill AIT number
    await page.fill('input[name="aitNumber"]', '1B892014');
    await page.fill('input[name="infractionCode"]', '745-50');
    await page.fill('input[name="description"]', 'Transitar em velocidade superior à máxima permitida em até 20%');
    await page.fill('input[name="ctbArticle"]', 'Art. 218, I do CTB');
    await page.fill('input[name="dateTime"]', '2025-01-15 10:30');
    await page.fill('input[name="location"]', 'Av. das Nações Unidas, alt. 14.401 — São Paulo/SP');
    await page.fill('input[name="speedLimit"]', '60');
    await page.fill('input[name="measuredSpeed"]', '71');
    await page.fill('input[name="consideredSpeed"]', '64');
    await page.fill('input[name="radarEquipmentId"]', 'RAD-INMETRO-7819');
    await page.fill('input[name="inmetroAferitionDate"]', '2024-04-12');
    await page.fill('input[name="notificationExpeditionDate"]', '2025-01-20');
    await page.fill('input[name="defenseDeadline"]', '2025-02-19');
    
    // Vehicle data
    await page.fill('input[name="plate"]', 'BRA2E19');
    await page.fill('input[name="brandModel"]', 'Toyota Corolla Cross XRE');
    await page.fill('input[name="renavam"]', '00123984712');
    await page.fill('input[name="year"]', '2024');
    await page.fill('input[name="color"]', 'Preto');
    
    await page.click('button:has-text("Próximo")');
    await expect(page.locator('text=Upload Opcional')).toBeVisible({ timeout: 5000 });
  });

  test('Step 5: Document Upload (Optional) - Skip', async () => {
    await expect(page.locator('text=Upload Opcional')).toBeVisible();
    await page.click('button:has-text("Pular")');
    await expect(page.locator('text=Confirmação dos Dados')).toBeVisible({ timeout: 5000 });
  });

  test('Step 6: Data Confirmation - Confirm and Run Analysis', async () => {
    await expect(page.locator('text=Confirmação dos Dados')).toBeVisible();
    await page.click('button:has-text("Confirmar e Executar Análise")');
    await expect(page.locator('text=Processamento da Análise')).toBeVisible({ timeout: 5000 });
  });

  test('Step 7: Analysis Processing - Wait for Completion', async () => {
    await expect(page.locator('text=Processamento da Análise')).toBeVisible();
    // Wait for analysis to complete (up to 30 seconds)
    await page.waitForSelector('text=Diagnóstico Jurídico Concluído', { timeout: 30000 });
  });

  test('Step 8: Free Analysis Result - Verify Art. 281-A Present', async () => {
    await expect(page.locator('text=Diagnóstico Jurídico Concluído')).toBeVisible();
    
    // Check for Art. 281-A in the analysis results
    await expect(page.locator('text=Art. 281-A')).toBeVisible();
    await expect(page.locator('text=Decadência da Notificação de Autuação')).toBeVisible();
    await expect(page.locator('text=96%')).toBeVisible(); // Success probability
    
    // Check other arguments present
    await expect(page.locator('text=Aferição Metrológica do Radar')).toBeVisible();
    await expect(page.locator('text=Conversão em Advertência')).toBeVisible();
    
    await page.click('button:has-text("Gerar Defesa Completa")');
    await expect(page.locator('text=Qualificação do Requerente')).toBeVisible({ timeout: 5000 });
  });

  test('Step 9: Required Data - Fill Applicant Data', async () => {
    await expect(page.locator('text=Qualificação do Requerente')).toBeVisible();
    
    await page.fill('input[name="applicantName"]', 'Carlos Eduardo Silveira');
    await page.fill('input[name="applicantCpf"]', '123.456.789-00');
    await page.fill('input[name="applicantRg"]', '12.345.678-9 SSP/SP');
    await page.fill('input[name="applicantCnh"]', '05492817492');
    await page.fill('input[name="cnhCategory"]', 'AB');
    await page.fill('input[name="applicantPhone"]', '(11) 98765-4321');
    await page.fill('input[name="applicantEmail"]', 'carlos.silveira@email.com');
    await page.fill('input[name="addressStreet"]', 'Rua das Flores');
    await page.fill('input[name="addressNumber"]', '450');
    await page.fill('input[name="addressComplement"]', 'Apto 82');
    await page.fill('input[name="addressNeighborhood"]', 'Vila Madalena');
    await page.fill('input[name="addressZipCode"]', '05445-010');
    await page.fill('input[name="addressCityState"]', 'São Paulo/SP');
    
    await page.click('button:has-text("Próximo")');
    await expect(page.locator('text=Revisão da Peça Jurídica')).toBeVisible({ timeout: 5000 });
  });

  test('Step 10: Document Review - Verify Generated Content', async () => {
    await expect(page.locator('text=Revisão da Peça Jurídica')).toBeVisible();
    
    // Verify key legal references in the document
    const docContent = await page.locator('main').textContent();
    
    // Check Art. 281-A is present
    expect(docContent).toContain('Art. 281-A');
    
    // Check official sources are referenced
    expect(docContent).toContain('Lei 14.071/2020');
    expect(docContent).toContain('Súmula 312');
    expect(docContent).toContain('CONTRAN');
    expect(docContent).toContain('INMETRO');
    
    // Check temporal application
    expect(docContent).toContain('2025'); // Year of infraction
    
    await page.click('button:has-text("Prosseguir para Pagamento")');
    await expect(page.locator('text=Emissão da Petição')).toBeVisible({ timeout: 5000 });
  });

  test('Step 11: Document Checkout - Generate and Verify PDF', async () => {
    await expect(page.locator('text=Emissão da Petição')).toBeVisible();
    
    // Click to generate PDF/Print
    await page.click('button:has-text("Gerar PDF")');
    
    // Wait for new tab/window with PDF
    const [pdfPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('button:has-text("Imprimir / Salvar PDF")'),
    ]);
    
    await pdfPage.waitForLoadState('networkidle');
    
    // Get PDF content
    const pdfText = await pdfPage.textContent();
    
    // Verify critical elements in PDF
    expect(pdfText).toContain('Art. 281-A');
    expect(pdfText).toContain('Decadência da Notificação de Autuação');
    expect(pdfText).toContain('Lei 14.071/2020');
    expect(pdfText).toContain('Súmula 312');
    expect(pdfText).toContain('Aferição Metrológica');
    expect(pdfText).toContain('Resolução CONTRAN');
    expect(pdfText).toContain('INMETRO');
    expect(pdfText).toContain('1B892014'); // AIT number
    expect(pdfText).toContain('BRA2E19'); // Plate
    expect(pdfText).toContain('Carlos Eduardo Silveira'); // Applicant name
    expect(pdfText).toContain('123.456.789-00'); // CPF
    
    // Verify temporal application - correct law version
    expect(pdfText).toContain('2025');
    
    await pdfPage.close();
  });
});

test.describe('Document Validation - Art. 281-A Corrections', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Verify Art. 281-A replaces old Art. 281-II', async () => {
    // Navigate through to step 8 quickly with pre-filled data
    await page.click('text=Defesa Prévia');
    await page.click('text=Radar / Medidor de Velocidade');
    await page.click('text=Defesa Prévia (Notificação de Autuação)');
    
    // Wait for step 4
    await page.waitForSelector('text=Dados da Autuação');
    
    // Quick fill
    await page.fill('input[name="aitNumber"]', '1B892014');
    await page.fill('input[name="infractionCode"]', '745-50');
    await page.fill('input[name="dateTime"]', '2025-01-15 10:30');
    await page.fill('input[name="notificationExpeditionDate"]', '2025-02-20'); // >30 days after infraction
    await page.fill('input[name="defenseDeadline"]', '2025-03-20');
    
    await page.click('button:has-text("Próximo")');
    await page.click('button:has-text("Pular")');
    await page.click('button:has-text("Confirmar e Executar Análise")');
    
    await page.waitForSelector('text=Diagnóstico Jurídico Concluído', { timeout: 30000 });
    
    // Verify Art. 281-A is present, NOT Art. 281-II
    const content = await page.textContent('main');
    expect(content).toContain('Art. 281-A');
    expect(content).not.toContain('Art. 281, II');
    expect(content).not.toContain('Art. 281-II');
    expect(content).not.toContain('Art. 281 II');
  });

  test('Verify official sources and temporal application in analysis', async () => {
    const content = await page.textContent('main');
    
    // Official sources
    expect(content).toContain('Lei 14.071/2020');
    expect(content).toContain('Código de Trânsito Brasileiro');
    expect(content).toContain('CONTRAN');
    expect(content).toContain('INMETRO');
    expect(content).toContain('Súmula 312');
    expect(content).toContain('STJ');
    
    // Temporal application - Lei 14.071/2020 applied
    expect(content).toContain('2020');
  });
});