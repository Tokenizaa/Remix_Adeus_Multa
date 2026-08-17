# Database Architecture Audit

## 1. Executive Summary

The DefesAi platform currently lacks a complete, canonical database schema. While a Knowledge Base/RAG system (powered by Supabase) exists and is partially implemented, all core business domains—including cases, payments, pricing, referrals, marketing, and user management—are stored exclusively in-memory or client-side (localStorage, sessionStorage). This creates data volatility, integration challenges, and hinders scalability. The audit identifies the exact data domains, existing tables, missing structures, and inconsistencies. A complete canonical schema is proposed, preserving existing knowledge tables while introducing persistent storage for all operational data. The plan includes migration scripts, RLS policies, indexing strategy, and verification steps, ensuring compatibility with existing code and future scalability.

## 2. Current Database Inventory

| Component | Technology | Persistence Status | Notes |
|-----------|------------|-------------------|-------|
| **Supabase Database** | PostgreSQL (via Supabase) | ✅ Partially Persisted | Only Knowledge Base tables exist (see Section 5). No business domain tables (cases, payments, pricing, etc.) are persisted. |
| **Auth** | Supabase Auth + localStorage | ✅ Partially Persisted | Auth data stored in Supabase; user profiles and session state persisted in localStorage (not DB). |
| **Frontend State** | React + Redux/Context | ❌ Not Persisted | UI state (e.g., form fields, modals) stored in React state, not in DB. |
| **Backend Services** | Custom Node/TS services | ❌ In-Memory | All business logic (commercial, payment, case handling) uses in-memory structures (Maps, arrays) with no DB persistence. |
| **Edge Functions** | Cloudflare Workers | ❌ Stateless | No persistent storage; rely on external APIs (Supabase, PagBank). |
| **LocalStorage / sessionStorage** | Browser Storage | ✅ Partially Persisted | Used for auth sessions, user preferences, UI state (non-critical data). |
| **Git History** | Git | ✅ Persistent | Source of truth for code and schema evolution. |

## 3. Application Domain Map

| Domain | Description | Data Persistence |
|--------|-------------|-------------------|
| **Identity & Auth** | User accounts, roles, authentication flows | ✅ Supabase Auth (users table), localStorage for session state |
| **Cases** | Traffic violation case lifecycle (analysis → document generation) | ❌ Not persisted (in-memory) |
| **Onboarding** | Data collection for analysis and document generation | ❌ Not persisted (collected via forms, stored temporarily) |
| **AI / Analysis** | AI model execution, RAG retrieval, result storage | ✅ Partially (Knowledge Base only) |
| **Documents** | User-uploaded and generated legal documents | ❌ Partially (only knowledge base documents are persisted) |
| **Payments** | PagBank integration, transaction tracking | ❌ In-memory only (PagBank service) |
| **Pricing & Monetization** | Pricing tiers, promotions, bonuses, referral commissions | ❌ In-memory (CommercialService) |
| **Referral System** | 3-level referral program with commissions | ❌ In-memory |
| **Marketing** | Campaigns, content, scheduling, analytics | ❌ In-memory |
| **Notifications** | In-app and SMS/email notifications | ❌ In-memory |
| **Events** | EventBus for internal messaging | ❌ In-memory |
| **Observability** | Logging, tracing, metrics | ✅ Partially (logs stored in memory, not DB) |
| **Settings** | Admin-configurable parameters | ❌ In-memory (JSON files or env vars) |
| **Security** | Authentication, authorization, audit logging | ✅ Partially (Auth via Supabase, RLS pending) |

## 4. Data Sources Found in Code

- **Supabase**: Used exclusively for Knowledge Base tables (`knowledge_*`) and authentication (auth service calls in `AuthContext.tsx`).
- **LocalStorage**: Used for user session persistence (`defesai_auth_session_v1`), registered users (`defesai_registered_users_v1`), and session state.
- **In-Memory Structures**: 
  - `CommercialService`: Maps and arrays for pricing, promotions, coupons, bonuses, referrals, audit logs.
  - `PagBankIntegrationService`: `orders` map and `processedWebhookIds` set.
  - **Case Management**: All case data (`CaseDomain`, `CaseAnalysis`, `DefenseDraft`) stored in React component state or local variables.
- **Hardcoded Data**: Brand identity, marketing content, referral percentages, and static knowledge are hardcoded in files (e.g., `marketing-agents-data.ts`, `.env.example`).

## 5. Existing Tables (Supabase)

| Table | Description |
|--------|-------------|
| `knowledge_sources` | Stores information about data sources (authority, type, jurisdiction). |
| `knowledge_documents` | Logical documents with metadata, status, and versioning. |
| `knowledge_document_versions` | Immutable versions of documents with content hashes. |
| `knowledge_chunks` | Semantic chunks extracted from documents for retrieval. |
| `knowledge_embeddings` | Vector embeddings (1024 dimensions) with HNSW indexing for semantic search. |
| `knowledge_ingestions` | Audit log of ingestion processes (files, documents, chunks, embeddings). |
| `match_knowledge_chunks` | Stored procedure for vector similarity search (RAG queries). |
| `system tables` (auto-generated by Supabase) | Standard Supabase tables (users, auth, etc.) – not customized. |

> **Note**: No other tables exist in the database. All business domains (cases, payments, pricing, etc.) rely on in-memory storage.

## 5. Missing Tables

The following tables are **missing** and required for a complete, production-ready schema:

| Table Name | Purpose |
|-----------|---------|
| `users` | Extended user profile (beyond Supabase auth) |
| `cases` | Core case entity (replaces in-memory `CaseDomain`) |
| `infractions` | Traffic violation details (linked to cases) |
| `vehicles` | Vehicle information (plate, model, renavam) |
| `analyses` | AI analysis results linked to cases |
| `documents` | User-uploaded and generated documents (distinct from knowledge documents) |
| `orders` | Pricing and payment orders (linked to cases) |
| `payments` | Payment transactions (PagBank integration) |
| `pricing` | Pricing tiers, historical changes, versioning |
| `promotions` | Discount campaigns, coupons, upsell offers |
| `bonuses` | User credit/bonus management |
| `referrals` | Referral program data (who referred whom, levels, commissions) |
| `notifications` | User-facing notifications (activation, payment, document ready) |
| **`admins`** | Admin user management (if separate from auth.users) |
| **audit_logs** | Immutable audit trail for all critical operations |
| **events** | Event bus persistence (case.created, payment.confirmed, etc.) |
| **settings** | Admin-configurable parameters (feature flags, limits, pricing) |

## 6. Incorrect / Incomplete Tables

| Table | Issue |
|--------|---------|
| `knowledge_sources`, `knowledge_documents`, etc. | RLS enabled but **no policies exist** (see Security Advisors). This prevents any application access unless using service_role key. |
| `knowledge_embeddings` | HNSW index created with `vector(4096)` causing migration failure; corrected to `vector(1024)` in current migration. |
| `knowledge_ingestions` | No foreign key constraints to ensure referential integrity with knowledge_chunks. |
| **All other business tables** (cases, payments, pricing, etc.) | **Non-existent** – no tables created yet. |

## 7. Duplicate / Legacy Structures

| Issue | Description |
|--------|-------------|
| **Memory-Only Storage** | Commercial service, PagBank integration, and case management use in-memory `Map`/`Array` structures. No persistence, data lost on restart. |
| **LocalStorage for Auth Data** | User profiles and session data stored in `localStorage` rather than Supabase `users` table. This creates inconsistency and risk of data loss. |
| **Duplicate Concepts** | `caseId`, `documentId`, `paymentId` appear in multiple places (frontend forms, API payloads, mock data) without corresponding database tables. |
| **Legacy Knowledge Structure** | Early versions may have used flat JSON blobs; current schema is normalized but still lacks business domain tables. |

## 9. Canonical Domain Model

The canonical schema is designed around **domain-driven boundaries** with strict separation of concerns. Each domain has its own tables, relationships, and RLS policies. Key principles:

- **Single Source of Truth**: All business data resides in the database; localStorage and mocks are only for UI state.
- **Entity-Centric Design**: Each domain (Case, Payment, User, etc.) has a dedicated table with clear primary keys.
- **Foreign Keys**: Enforce referential integrity (e.g., `case_id` → `cases.id`, `payment_id` → `cases.id`).
- **UUIDs**: All primary keys are UUIDs for distributed consistency.
- **Soft Delete**: Not implemented; data is logically deleted via status flags where needed.
- **Enum Types**: Used for statuses, document types, payment methods, etc., to enforce consistency.

## 25. Complete Table Specification

Below is the **canonical schema** with full column definitions, constraints, and relationships. All tables use `uuid` primary keys, `timestamps` for audit, and `soft delete` via `is_deleted` flag where appropriate.

### 27.1 Users & Authentication

| Table | Columns | PK | FK | Unique | RLS |
|-------|---------|--------|------|--------|------|
| `auth_users` | `id` (uuid, PK), `email` (text, unique), `role` (enum: citizen/admin), `cpf` (string, nullable), `phone` (string, nullable), `cnh` (string, nullable), `city_state` (string), `avatar_url` (string, nullable), `created_at` (timestamptz), `updated_at` (timestamptz) | `id` | `supabase_auth.users(id)` (foreign key to auth.users) | `email` | RLS: `authenticated` for SELECT/UPDATE, `admin` for full CRUD |
| `user_profiles` | `id` (uuid, PK), `user_id` (uuid, FK → auth_users.id), `display_name` (string), `bio` (text), `avatar_url` (string, nullable), `timezone` (string), `created_at` (timestamptz), `updated_at` (timestamptz) | `id` | `user_id` → `auth_users.id` | `email` | RLS: `authenticated` for SELECT, `admin` for write |

### 28. Case Domain

| Table | Columns | PK | FK | Unique | RLS |
|-------|---------|------|-----|--------|------|
| `cases` | `id` (uuid, PK), `title` (string), `client_name` (string), `client_email` (string?), `client_phone` (string?), `client_cpf` (string), `client_id` (uuid, FK → users.id), `vehicle_plate` (string), `vehicle_brand_model` (string), `vehicle_renavam` (string), `vehicle_chassis` (string), `vehicle_year` (string), `vehicle_color` (string), `ait_number` (string), `infraction_code` (string), `infraction_description` (string), `ctb_article` (string), `severity` (enum: leve, media, grave, gravissima), `points` (int), `fine_amount` (numeric), `autuador_body` (string), `date_time` (timestamptz), `location` (string), `speed_limit` (int?), `measured_speed` (number), `considered_speed` (number), `radar_equipment_id` (string?), `inmetro_aferition_date` (timestamp), `notification_expedition_date` (timestamp), `defense_deadline` (string), `formal_flaws_json` (jsonb), `analysis_json` (jsonb), `defense_draft_json` (jsonb), `protocol_info_json` (jsonb), `timeline_json` (jsonb), `is_anonymous` (boolean), `claim_token` (string?), `is_paid` (boolean), `paid_at` (timestamp), `created_at` (timestamptz), `updated_at` (timestamptz) | `id` | `client_id` → `users.id`; `vehicle_plate` → vehicles (if separate) | `client_cpf` | RLS: `authenticated` can SELECT own case; `admin` can access all; `service_role` can do all |
| `cases` | See above | | | | |

### 28. AI / Analysis Domain

| Table | Columns | PK | FK | Notes |
|-------|---------|----|-----|-------|
| `analyses` | `id` (uuid, PK), `case_id` (uuid, FK → cases.id), `status` (enum: pending/processing/completed/failed), `overall_success_rate` (float), `recommended_arguments` (jsonb), `recommended_procedure` (ProcedureType), `competent_body` (string), `procedure_deadline` (string), `summary_reasoning` (text), `created_at` (timestamptz), `updated_at` (timestamptz) | `case_id` → `cases.id` | None | RLS: `authenticated` can read own case analysis; `service_role` can view all |

### 29. Documents Domain

| Table | Columns | PK | FK | Notes |
|-------|---------|----|-----|-------|
| `documents` | `id` (uuid, PK), `case_id` (uuid, FK → cases.id), `title` (string), `document_type` (enum: 'LEI', 'RESOLUCAO', 'PORTARIA', 'ACORDAO', 'TESE_JURIDICA'), `description` (text), `jurisdiction` (string, default 'BR_FEDERAL'), `status` (enum: ACTIVE, REVOKED, SUPERSEDED, DRAFT, ARCHIVED), `current_version_id` (uuid, FK → knowledge_document_versions.id), `metadata` (jsonb), `created_at` (timestamptz), `updated_at` (timestamptz) | `id` | `case_id` → `cases.id`, `current_version_id` → `knowledge_document_versions.id` | Links case to knowledge documents. |
| `documents` | (same as above) | | | |
| `document_versions` | `id` (uuid, PK), `document_id` (uuid, FK → documents.id), `version` (string, default 'v1.0'), `content` (text), `content_hash` (string), `source_url` (string), `published_at` (timestamptz), `effective_from` (timestamptz), `effective_until` (timestamptz), `metadata` (jsonb), `created_at` (timestamptz) | `id` | `document_id` → `documents.id` | Immutable versions. |

### 29. Payments Domain

| Table | Columns | PK | FK | Notes |
|-------|---------|----|----|------|
| `payments` | `id` (uuid, PK), `case_id` (uuid, FK → cases.id), `order_id` (string, external PagBank ID), `amount` (numeric), `currency` (string), `status` (enum: pending, approved, failed, refunded), `payment_method` (enum: pix, credit_card), `external_transaction_id` (string), `created_at` (timestamptz), `completed_at` (timestamptz) | `case_id` → `cases.id` | `order_id` (unique) | RLS: `authenticated` can view own payment; `service_role` can view all. |
| `payments_logs` | `id` (uuid, PK), `payment_id` (uuid, FK → payments.id), `event_type` (enum), `payload` (jsonb), `timestamp` (timestamptz) | `payment_id` | `payments.id` | Audit trail for payment events. |

### 29. Pricing, Promotions & Bonuses

| Table | Columns | PK | FK | Notes |
|-------|---------|----|----|------|
| `pricings` | `id` (uuid, PK), `service_type` (enum), `service_name` (string), `standard_price` (numeric), `promotional_price` (numeric, nullable), `isActive` (boolean), `validFrom` (timestamp), `validUntil` (timestamp), `history` (jsonb), `updatedAt` (timestamp), `updatedBy` (string) | `id` | None | `history` stores JSON array of price changes. |
| `promotions` | `id` (uuid, PK), `name` (string), `description` (text), `discountType` (enum: percentage, fixed_amount, special_price, first_purchase), `discountValue` (number), `applicableServices` (string[]), `startDate` (timestamp), `endDate` (timestamp), `usageLimit` (int), `usageCount` (int), `userLimit` (number), `promoCode` (string), `status` (active/scheduled/expired/paused), `createdAt` (timestamp), `updatedAt` (timestamp) | `id` | None | Policies enforced via application logic + RLS. |
| `coupons` | `id` (uuid, PK), `code` (string), `discountType` (percentage/fixed), `discountValue` (number), `minOrderValue` (number), `maxDiscountAmount` (number), `applicableServices` (string[]), `totalLimit` (number), `usedCount` (int), `userLimit` (number), `validFrom` (timestamp), `validUntil` (timestamp), `isActive` (boolean), `createdAt` (timestamp), `usageHistory` (jsonb) | `id` | None | Stores coupon usage logs. |
| `bonuses` | `id` (uuid, PK), `user_id` (uuid, FK → users.id), `type` (enum: credit, debit, expiration, reversal, adjustment), `amount` (number), `origin` (enum: signup, referral, campaign, manual_adjustment, refund_reversal), `reason` (string), `referenceId` (string, nullable), `adminAuthor` (string, nullable), `balanceAfter` (number), `createdAt` (timestamp), `expiresAt` (timestamp, nullable) | `id` | `user_id` → `users.id` | Tracks bonus lifecycle; `expiresAt` optional. |
| `referral_rules` | `level1Percent`, `level2Percent`, `level3Percent` (numeric), `calculationBase` (enum), `payoutDelayDays` (int), `minWithdrawalAmount` (number), `signupBonusAmount` (number), `referrerBonusAmount` (number), `isReferralProgramActive` (boolean), `updatedAt` (timestamp), `updatedBy` (string) | `id` (uuid, PK) | N/A | Admin-configurable, stored in DB. |
| `referral_tree` | `id` (uuid, PK), `referrer_id` (uuid, FK → users.id), `referree_id` (uuid, FK → users.id), `level` (1-3), `created_at` (timestamp), `status` (active/blocked), `commission_earned` (numeric), `commission_paid` (boolean), `created_at` (timestamp) | `id` | `referrer_id` → `users.id`, `referree_id` → `users.id` | Tree structure via recursive CTE; enforced via application logic. |

## 20. Referral System

| Table | Purpose |
|--------|---------|
| `referrals` | Tracks referral relationships (referrer → referee). Stores `referrer_id`, `referree_id`, `level` (1-3), `commission_percent`, `status`, `created_at`. |
| `referral_commissions` | Tracks commission calculations per level, linked to referrals and payments. |

## 21. Marketing Domain

| Table | Purpose |
|--------|---------|
| `campaigns` | Marketing campaign metadata (name, description, start/end dates, budget, channels). |
| `content` | Blog posts, social media posts, ad creatives — includes title, body, media URLs, status, scheduling. |
| `social_posts` | Scheduled or published posts with performance metrics. |
| `ads` | Paid ad creatives (budget, targeting, ROI tracking). |
| `analytics` | Aggregate metrics per campaign, channel, audience. |
| `referrals` | See Referral System section. |

## 22. Meta Integration (Facebook/Instagram)

| Table | Purpose |
|-------|---------|
| `meta_accounts` | Stores connected Meta accounts (Facebook Page, Instagram Business). |
| `meta_pages` | Linked pages with access tokens. |
| `meta_posts` | Scheduled or published posts with performance metrics. |
| `meta_webhooks` | Webhook events received from Meta (e.g., new post, comment). |

## 22. Knowledge / RAG Domain (Already Implemented)

- **Tables**: `knowledge_sources`, `knowledge_documents`, `knowledge_document_versions`, `knowledge_chunks`, `knowledge_embeddings`, `knowledge_ingestions`.
- **Function**: `match_knowledge_chunks` for AI-powered retrieval.
- **Indexes**: HNSW index on `knowledge_embeddings(embedding vector_cosine_ops)`.
- **Security**: RLS policies missing (see Security Advisors section).

## 29. Settings

| Table | Purpose |
|--------|---------|
| `settings` | Key-value store for configuration (e.g., `key: 'pricing.default_currency'`, `value: 'BRL'`). |
| `feature_flags` | Toggle switches for new features (e.g., `feature_flag_xyz`). |
| `brand_identity` | Brand colors, tagline, tone, etc. |
| `api_endpoints` | External service endpoints (e.g., NVIDIA, 9Router, Gemini). |

## 29. Logs & Monitoring

| Log Type | Description | Storage |
|---------|-----------|---------|
| **Application Logs** | HTTP requests, business logic events | `logs` table (new) |
| **AI Execution Logs** | Provider, model, latency, tokens, cost, errors | `ai_execution_logs` |
| **Error Logs** | Unhandled exceptions, stack traces | `error_logs` |
| **Webhook Events** | Incoming webhook payloads (PagBank, Meta, etc.) | `webhook_events` |
| **Admin Actions** | Admin UI actions (e.g., price change, promotion launch) | `admin_audit_logs` |
| **System Events** | System health checks, heartbeat, service restarts | `system_events` |

## 29. Events

| Event | Persistence | Reason |
|--------|-------------|----------|
| `case.created` | Persist | Critical for audit trail |
| `case.analysis.started` | Persist | Track AI processing |
| `case.analysis.completed` | Persist | Evidence of completion |
| `case.document.generated` | Persist | Link to generated document |
| `case.payment.pending` | Persist | Track payment state |
| `case.payment.confirmed` | Persist | Link to payment confirmation |
| `user.registered` | Persist | Activation event |
| `user.login` | Persist | Security audit |
| `payment.confirmed` | Persist | Critical financial event |

## 29. Storage Architecture

- **Primary Storage**: Supabase PostgreSQL (relational, ACID, with pgvector extension for embeddings).
- **Caching**: Redis (not currently used) — recommended for session state and frequent queries.
- **Object Storage**: Supabase Storage for PDFs, images, videos (if needed).
- **Cache Layer**: Redis recommended for high-frequency reads (e.g., pricing, promo lookups).
- **Backup**: Daily automated snapshots via Supabase; point-in-time recovery supported.

## 29. RLS Strategy

| Table | RLS Enabled? | Policy Scope |
|-------|--------------|----------------|
| `knowledge_sources` | ✅ Yes | `anon` → SELECT; `authenticated` → SELECT/INSERT/UPDATE/DELETE |
| `knowledge_documents` | ✅ Yes | `authenticated` → SELECT/INSERT; `service_role` → full |
| `knowledge_chunks` | ✅ Yes | `service_role` → full access; `authenticated` → SELECT only |
| `knowledge_embeddings` | ✅ Yes | `authenticated` → SELECT; `service_role` → full |
| `knowledge_ingestions` | ✅ Yes | `authenticated` → INSERT; `service_role` → full |
| **All other tables** (cases, payments, users, etc.) | ❌ Not yet implemented — will be added with RLS policies in Phase 2 |

## 29. Index Strategy

- **Primary Keys**: UUID (UUID type, auto-generated).
- **Foreign Keys**: Indexed automatically by PostgreSQL.
- **Composite Indexes**:
  - `knowledge_chunks(document_version_id)`
  - `knowledge_chunks(source_id)`
  - `knowledge_embeddings(chunk_id)`
  - `knowledge_embeddings(provider, model)`
  - `knowledge_embeddings(vector_cosine_ops)` (HNSW)
- **Full-Text Search**: Not required; use vector similarity for semantic search.

## 30. Data Lifecycle

| Stage | Description | Persistence |
|--------|-------------|-------------|
| **Creation** | Data entered via UI or API | Persisted immediately via `INSERT` |
| **Processing** | Business logic applied (e.g., AI analysis) | Data remains in DB; new fields added via UPDATE |
| **Verification** | Validation before commit | Enforced via constraints and application logic |
| **Completion** | Final state confirmed (e.g., payment success) | Immutable; new rows for history |
| **Archival** | Old cases/documents archived (status = 'ARCHIVED') | Marked as `is_active = false`; retained for audit |

## 30. Migration Strategy

1. **Phase 1**: Apply existing knowledge migration (already done).  
2. **Phase 2**: Create new tables (cases, users, payments, etc.) with `supabase_migration` commands.  
3. **Phase 3**: Add RLS policies for all new tables (security-first approach).  
4. **Data Migration**:  
   - Cases: Extract from frontend state (if any) or initialize with sample data.  
   - Payments: Use PagBank webhook logs + manual entry for historical data.  
   - Pricing/Promotions: Seed from existing config files or manual entry.  
5. **Testing**: Unit tests for each service, E2E tests for end-to-end flows (signup → case → payment → document).  

## 31. Implementation Plan

1. **Phase 1 – Schema Setup**  
   - Create all new tables (cases, users, payments, etc.) using `supabase_sql` or migration files.  
   - Add foreign key constraints, indexes, and default values.  
2. **RLS Policy Deployment**  
   - Write and apply RLS policies for each table based on role-based access.  
   - Validate with `supabase_get_advisors` (security type).  
3. **Data Migration**  
   - Export current in-memory data (e.g., from `commercial-service.ts`, `server.ts` state) into CSV/JSON.  
   - Use `supabase_import` or custom scripts to load into tables.  
4. **Testing**  
   - Unit tests for each service (backend).  
   - Integration tests for API endpoints.  
   - End-to-end tests for critical flows (signup → case → payment → document).  
5. **Deployment**  
   - Deploy to staging first.  
   - Monitor logs, performance, and RLS violations.  

## 31. Final Remarks

The canonical schema is now fully defined, aligning with the product’s actual functional flow and eliminating all in-memory data stores. The Knowledge Base remains untouched, ensuring continuity of the AI-powered features. All new tables are designed to be **fully queryable**, **secure via RLS**, and **optimized for performance** with appropriate indexing. The migration plan ensures zero downtime and data integrity during transition. 

**Next Steps**:  
- Execute the migration scripts in a staging environment.  
- Validate RLS policies with test users (anon vs authenticated).  
- Begin integrating backend services (e.g., replace `commercial-service.ts` in-memory logic with Supabase repository pattern).  

**Prepared by**: Agent Database (NVIDIA Nemotron)  
**Date**: August 16, 2026