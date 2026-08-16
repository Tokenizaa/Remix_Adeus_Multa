# Documentação Técnica: Integrações Oficiais Meta & PagBank — DefesAi

## 1. Princípios Arquiteturais e de Segurança
1. **Zero Secret Leakage:** Nenhuma chave privada (`META_APP_SECRET`, `META_ACCESS_TOKEN`, `PAGBANK_TOKEN`, `PAGBANK_WEBHOOK_SECRET`) é enviada ao cliente web ou exposta em bundles do Vite.
2. **Camada de Integração Centralizada:**
   - Meta: `src/server/integrations/meta.ts` (servidor) e `src/core/integrations/meta-client.ts` (cliente).
   - PagBank: `src/server/integrations/pagbank.ts` (servidor) e `src/core/integrations/pagbank-client.ts` (cliente).
3. **Respeito Estrito ao Modelo de 2 Etapas da DefesAi:**
   - **Etapa 1 — Análise Gratuita:** Diagnóstico técnico do auto de infração, enquadramento no CTB e identificação de nulidades formais (100% gratuito).
   - **Etapa 2 — Geração do Documento:** Checkout oficial via PagBank (PIX EMV / QR Code) para emissão da minuta formal em PDF.

---

## 2. Integração Meta (Facebook + Instagram)

### Arquitetura de Endpoints:
- `GET /api/integrations/meta/status`: Retorna o status de conexão da página e contas do Instagram vinculadas.
- `GET /api/integrations/meta/auth-url`: Gera o link de autorização OAuth Graph API v20.0 com os escopos `pages_manage_posts`, `instagram_basic`, `instagram_content_publish`.
- `POST /api/integrations/meta/connect`: Conecta via Token de Usuário do Sistema ou Page Access Token.
- `POST /api/integrations/meta/disconnect`: Encerra a sessão ativa de publicação.
- `POST /api/integrations/meta/publish`: Dispara publicação para a Página do Facebook (`/{page_id}/feed`) ou cria contêiner e publica no Instagram Business (`/{ig_user_id}/media` e `/{ig_user_id}/media_publish`).

---

## 3. Integração PagBank (Pedidos, PIX & Webhooks)

### Arquitetura de Endpoints:
- `POST /api/payments/pagbank/orders`: Cria pedido oficial via Orders API v2 com geração de QR Code e payload copia-e-cola EMV do PIX.
- `GET /api/payments/pagbank/orders/:id`: Polling de status do pedido.
- `POST /api/webhooks/pagbank`: Receptor de Webhooks oficial do PagBank com verificação de assinatura e **controle de idempotência** (evita processamento duplicado de transações).
- `POST /api/payments/pix/simulate-confirm`: Aciona o fluxo seguro de confirmação para ambientes locais ou demonstrações, sincronizando o status do caso para `defesa_pronta` e avançando a etapa para liberação do documento.

---

## 4. Variáveis de Ambiente (.env.example)

```env
# Meta
META_APP_ID=
META_APP_SECRET=
META_ACCESS_TOKEN=
META_PAGE_ID=
INSTAGRAM_ACCOUNT_ID=

# PagBank
PAGBANK_TOKEN=
PAGBANK_ENV=sandbox
PAGBANK_WEBHOOK_SECRET=
```
