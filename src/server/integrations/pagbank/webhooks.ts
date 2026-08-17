// PagBank Webhooks - Robust webhook handler with HMAC verification and idempotency
// Based on DefesAi v1 implementation

import type {
  PagBankOrderResponse,
  PagBankCharge,
  PagBankQRCode,
  PagBankPaymentMethod,
  PagBankEnvironment,
  PagBankApiError,
  PagBankErrorResponse,
} from './types';
import { pagbankServer } from './client.server';
import { savePaymentToDatabase } from './orders';
import { mapearStatusPagBank } from './types';
import { supabase } from '../../lib/supabaseClient'; // Assuming this is your Supabase client

// Verify HMAC signature (PagBank signature header)
function verifyHmacSignature(
  body: string,
  signatureHeader: string
): boolean {
  const crypto = require('node:crypto');
  const expectedSignature = signatureHeader.replace('sha256=', '');
  
  const hmac = crypto.createHmac('sha256', process.env.PAGBANK_WEBHOOK_SECRET!);
  hmac.update(body);
  
  const calculatedSignature = hmac.digest('hex');
  
  // Use timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature),
    Buffer.from(expectedSignature)
  );
}

// Process webhook payload
async function processWebhook(payload: any): Promise<void> {
  try {
    // Validate payload structure
    if (!payload.order_id || !payload.charge_id || !payload.status) {
      throw new Error('Invalid webhook payload: missing required fields');
    }

    // Check if we've already processed this webhook
    const { data: existing } = await supabase
      .from('payment_events')
      .select('id')
      .eq('payload_id', payload.id)
      .single();

    if (existing) {
      console.log('[PagBank] Webhook already processed, skipping:', payload.id);
      return;
    }

    // Find the order in our database
    const { data: order } = await supabase
      .from('payment_orders')
      .select('*')
      .eq('pagbank_order_id', payload.order_id)
      .single();

    if (!order) {
      console.warn('[PagBank] Order not found in our database:', payload.order_id);
      return;
    }

    // Update order status based on webhook status
    const newStatus = mapearStatusPagBank(payload.status);
    const { error } = await supabase
      .from('payment_orders')
      .update({ status: newStatus, status_detail: payload.status })
      .eq('pagbank_order_id', payload.order_id);

    if (error) throw error;

    // Save webhook event for audit
    const { error: eventError } = await supabase.from('payment_events').insert({
      payment_id: order.id,
      event_type: 'status_changed',
      payload,
      idempotency_key: payload.id,
      created_at: new Date().toISOString(),
    });

    if (eventError) throw eventError;

    console.log('[PagBank] Webhook processed successfully:', payload.order_id, payload.status);
  } catch (error) {
    console.error('[PagBank] Webhook processing error:', error);
    // We don't throw to avoid retry loops - PagBank will retry automatically
  }
}

// Main webhook handler
export async function handlePagBankWebhook(
  request: Request,
  response: Response
): Promise<void> {
  try {
    // Verify HMAC signature
    const signatureHeader = request.headers.get('x-pagbank-signature');
    if (!signatureHeader) {
      throw new PagBankApiError('Missing x-pagbank-signature header', 400, {
        error: 'Missing signature header',
      });
    }

    const body = await request.text();
    if (!verifyHmacSignature(body, signatureHeader)) {
      throw new PagBankApiError('Invalid signature', 401, {
        error: 'Invalid HMAC signature',
      });
    }

    // Parse JSON payload
    const payload = JSON.parse(body);

    // Process the webhook
    await processWebhook(payload);

    // Return 200 OK to acknowledge receipt
    response.status(200).send('Webhook processed');
  } catch (error) {
    if (error instanceof PagBankApiError) {
      response.status(error.status).send(error.message);
    } else {
      console.error('[PagBank] Unexpected webhook error:', error);
      response.status(500).send('Internal server error');
    }
  }
}

// Helper to get webhook ID from payload
function getWebhookId(payload: any): string {
  return payload.id || payload.order_id || payload.charge_id || 'unknown';
}

// Export the handler for API routes
export { handlePagBankWebhook, processWebhook };