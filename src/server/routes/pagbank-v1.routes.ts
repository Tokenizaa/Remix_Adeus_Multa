import { Router, Request, Response } from 'express';
import { criarPagamentoDefesa, consultarPagamento, cancelarPagamento, reembolsarPagamento, DefesaPagamentoData } from '../integrations/pagbank/orders';
import { handlePagBankWebhook } from '../integrations/pagbank/webhooks';
import { commercialService } from '../commercial/commercial-service';
import { databaseRows, auditLogs } from '../app';
import { CanonicalMapper } from '../../core/mappers/canonical-mapper';
import { eventBus, EventTopics } from '../../core/events/topics';
import { logger } from '../observability/logger';
import { CaseDomain } from '../../types';

const router = Router();

// PagBank Order Creation Endpoint (PIX)
router.post('/orders', async (req, res) => {
  try {
    const { caseId, customerName, customerEmail, customerCpf, amount = 89.90 } = req.body;
    
    // Construir DefesaPagamentoData a partir da requisição
    const defesaData: DefesaPagamentoData = {
      caseId: caseId || `case_${Date.now()}`,
      caseType: 'defesa_previa',
      valor: Math.round(amount * 100), // Converter para centavos
      cliente: {
        nome: customerName || 'Condutor DefesAi',
        email: customerEmail || 'contato@defesai.com.br',
        cpf: customerCpf.replace(/\D/g, '') || '12345678909',
        telefone: undefined
      },
      endereco: undefined,
      paymentMethod: 'PIX',
      installments: 1,
      description: undefined,
      returnUrl: undefined,
      notificationUrl: `${process.env.APP_URL || process.env.VITE_APP_URL || 'https://defesai.com.br'}/api/webhooks/pagbank`,
      userId: undefined
    };

    const result = await criarPagamentoDefesa(defesaData);

    // Atualizar caso com referência de pagamento se existir
    if (caseId) {
      const row = databaseRows.get(caseId);
      if (row) {
        const domain = CanonicalMapper.rowToDomain(row);
        domain.payment = {
          status: 'pending',
          amount,
          transactionId: result.order.id,
          paymentMethod: 'pix',
        };
        const updatedRow = CanonicalMapper.domainToRow(domain);
        databaseRows.set(caseId, updatedRow);
      }
    }

    res.json({
      success: true,
      order: result.order,
      pixCopyPasteString: result.pixCode,
      qrCodeDataUrl: result.paymentUrl, // Assumindo que paymentUrl é a URL da imagem do QR code
      txId: result.order.id,
      status: 'aguardando_pagamento',
    });
  } catch (error: any) {
    logger.error('payments', 'pagbank', 'create_pix_order', 'Erro ao criar ordem PIX', { error: error.message });
    res.status(500).json({ error: error.message || 'Erro ao gerar pedido PagBank' });
  }
});

// Alias for existing frontend compatibility
router.post('/pix/create', async (req, res) => {
  try {
    const { caseId, amount = 89.90, customerCpf, customerName, customerEmail } = req.body;
    
    // Construir DefesaPagamentoData a partir da requisição
    const defesaData: DefesaPagamentoData = {
      caseId: caseId || `case_${Date.now()}`,
      caseType: 'defesa_previa',
      valor: Math.round(amount * 100), // Converter para centavos
      cliente: {
        nome: customerName || 'Condutor DefesAi',
        email: customerEmail || 'contato@defesai.com.br',
        cpf: customerCpf.replace(/\D/g, '') || '12345678909',
        telefone: undefined
      },
      endereco: undefined,
      paymentMethod: 'PIX',
      installments: 1,
      description: undefined,
      returnUrl: undefined,
      notificationUrl: `${process.env.APP_URL || process.env.VITE_APP_URL || 'https://defesai.com.br'}/api/webhooks/pagbank`,
      userId: undefined
    };

    const result = await criarPagamentoDefesa(defesaData);

    res.json({
      success: true,
      txId: result.order.id,
      amount: result.order.amount_cents / 100,
      pixCopyPasteString: result.pixCode,
      qrCodeDataUrl: result.paymentUrl, // Assumindo que paymentUrl é a URL da imagem do QR code
      expiresInMinutes: 30,
      status: 'aguardando_pagamento',
      order: result.order,
    });
  } catch (err: any) {
    logger.error('payments', 'pagbank', 'create_pix_order_alias', 'Erro ao criar ordem PIX', { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// PagBank Order Status polling endpoint
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await consultarPagamento(req.params.id);
    res.json(order);
  } catch (error: any) {
    logger.error('payments', 'pagbank', 'get_order', 'Erro ao buscar ordem', { error: error.message });
    res.status(500).json({ error: error.message || 'Erro ao buscar pedido PagBank' });
  }
});

// PagBank Official Webhook with HMAC-SHA256 Signature Verification & Idempotency
router.post('/webhooks', async (req: Request, res: Response) => {
  try {
    // Processar webhook usando nossa implementação v1
    await handlePagBankWebhook(req as any, res as any);
    // Nota: handlePagBankWebhook já envia a resposta, então não precisamos fazer nada mais aqui
  } catch (error: any) {
    logger.error('payments', 'pagbank', 'webhook', 'Erro no processamento do webhook', { error: error.message });
    res.status(400).json({ error: error.message });
  }
});

// Simulate confirm for local testing / instant preview
router.post('/pix/simulate-confirm', async (req, res) => {
  const { caseId } = req.body;
  const row = databaseRows.get(caseId);
  if (!row) {
    return res.status(404).json({ error: 'Caso não encontrado' });
  }

  try {
    // Para simulação, vamos criar um pagamento e depois confirmá-lo
    const defesaData: DefesaPagamentoData = {
      caseId,
      caseType: 'defesa_previa',
      valor: 8990, // R$ 89,90 em centavos
      cliente: {
        nome: 'Condutor DefesAi',
        email: 'contato@defesai.com.br',
        cpf: '12345678909',
        telefone: undefined
      },
      endereco: undefined,
      paymentMethod: 'PIX',
      installments: 1,
      description: undefined,
      returnUrl: undefined,
      notificationUrl: `${process.env.APP_URL || process.env.VITE_APP_URL || 'https://defesai.com.br'}/api/webhooks/pagbank`,
      userId: undefined
    };

    const result = await criarPagamentoDefesa(defesaData);
    
    // Como estamos simulando confirmação, vamos atualizar diretamente o status
    // Em um cenário real, isso aconteceria via webhook
    const domain = CanonicalMapper.rowToDomain(row);
    domain.isPaid = true;
    domain.paidAt = new Date().toISOString();
    domain.status = 'defesa_pronta';
    domain.currentStage = 3;
    domain.payment = {
      status: 'approved',
      amount: 89.90,
      paidAt: new Date().toISOString(),
      transactionId: result.order.id,
      paymentMethod: 'pix',
    };
    domain.updatedAt = new Date().toISOString();

    domain.timeline.push({
      id: `tl_pay_${Date.now()}`,
      title: 'Pagamento PIX Compensado (PagBank)',
      description: 'Acesso liberado à minuta jurídica formal para impressão e orientações de protocolo.',
      timestamp: new Date().toISOString(),
      type: 'payment',
    });

    const updatedRow = CanonicalMapper.domainToRow(domain);
    databaseRows.set(domain.id, updatedRow);

    // Disparar Evento de Pagamento Comercial (Calcula comissões de 3 níveis & ledgers)
    commercialService.processPaymentConfirmationEvent({
      paymentId: result.order.id,
      caseId: domain.id,
      buyerUserId: domain.clientEmail || `usr_${domain.id.substring(0, 8)}`,
      buyerUserName: domain.clientName || 'Condutor DefesAi',
      grossAmount: domain.payment?.amount || 89.90,
      discountAmount: 0,
      effectivelyPaid: domain.payment?.amount || 89.90,
    });

    auditLogs.unshift({
      id: `audit_pay_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: domain.clientName || 'Cliente',
      role: 'citizen',
      action: 'PAYMENT_CONFIRMED',
      targetResource: domain.id,
      ipHash: '3a88c42b109e',
      details: `Pagamento de R$ 89,90 via PIX PagBank confirmado.`,
      gdprCompliant: true,
    });

    res.json({
      success: true,
      message: 'Pagamento confirmado com sucesso!',
      case: domain,
      order: result.order,
    });
  } catch (error: any) {
    logger.error('payments', 'pagbank', 'pix_simulate_confirm', 'Erro ao simular confirmação PIX', { error: error.message });
    res.status(500).json({ error: error.message || 'Erro ao simular confirmação de pagamento' });
  }
});

export default router;