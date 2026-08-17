-- ==============================================================================
-- CANONICAL RAG & KNOWLEDGE BASE SCHEMA FOR DEFESAI
-- Migration: 20260816000001_canonical_rag_schema.sql
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ==============================================================================
-- 2. KNOWLEDGE SOURCES
-- Representa a origem e autoridade da informação jurídica
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.knowledge_sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN (
        'LAW', 'REGULATION', 'JURISPRUDENCE', 'GOVERNMENT', 
        'TECHNICAL', 'INTERNAL', 'MANUAL', 'OTHER'
    )),
    authority TEXT NOT NULL, -- Ex: 'CONTRAN', 'SENATRAN', 'CONGRESSO NACIONAL', 'STJ'
    description TEXT,
    url TEXT,
    jurisdiction TEXT NOT NULL DEFAULT 'BR_FEDERAL', -- 'BR_FEDERAL', 'SP_ESTADUAL', etc.
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. KNOWLEDGE DOCUMENTS
-- Documento lógico abstrato (pode conter múltiplas versões ao longo do tempo)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.knowledge_documents (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL REFERENCES public.knowledge_sources(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    document_type TEXT NOT NULL, -- 'LEI', 'RESOLUCAO', 'PORTARIA', 'ACORDAO', 'TESE_JURIDICA'
    description TEXT,
    jurisdiction TEXT NOT NULL DEFAULT 'BR_FEDERAL',
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVOKED', 'SUPERSEDED', 'DRAFT', 'ARCHIVED')),
    current_version_id TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. KNOWLEDGE DOCUMENT VERSIONS
-- Versão física de um documento, garantindo imutabilidade e rastreabilidade
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.knowledge_document_versions (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL REFERENCES public.knowledge_documents(id) ON DELETE CASCADE,
    version TEXT NOT NULL DEFAULT 'v1.0',
    content TEXT NOT NULL,
    content_hash TEXT NOT NULL, -- SHA-256 do conteúdo para deduplicação
    source_url TEXT,
    published_at TIMESTAMPTZ,
    effective_from TIMESTAMPTZ,
    effective_until TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Adicionar Foreign Key circular do current_version_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_knowledge_documents_current_version'
    ) THEN
        ALTER TABLE public.knowledge_documents
        ADD CONSTRAINT fk_knowledge_documents_current_version
        FOREIGN KEY (current_version_id) REFERENCES public.knowledge_document_versions(id)
        DEFERRABLE INITIALLY DEFERRED;
    END IF;
END $$;

-- ==============================================================================
-- 5. KNOWLEDGE CHUNKS
-- Unidades semânticas de recuperação (artigos, parágrafos, seções, teses)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
    id TEXT PRIMARY KEY,
    document_version_id TEXT NOT NULL REFERENCES public.knowledge_document_versions(id) ON DELETE CASCADE,
    document_id TEXT NOT NULL REFERENCES public.knowledge_documents(id) ON DELETE CASCADE,
    source_id TEXT NOT NULL REFERENCES public.knowledge_sources(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    token_count INTEGER NOT NULL DEFAULT 0,
    heading TEXT,
    article_number TEXT,
    section_name TEXT,
    jurisdiction TEXT NOT NULL DEFAULT 'BR_FEDERAL',
    document_type TEXT NOT NULL DEFAULT 'LEI',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 6. KNOWLEDGE EMBEDDINGS
-- Vetores gerados pelos provedores de IA (NVIDIA NIM / 9Router / Gemini)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.knowledge_embeddings (
    id TEXT PRIMARY KEY,
    chunk_id TEXT NOT NULL REFERENCES public.knowledge_chunks(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- 'NVIDIA', '9ROUTER', 'GEMINI'
    model TEXT NOT NULL,    -- 'nvidia/nv-embedqa-e5-v5', 'snowflake/arctic-embed-l'
    dimensions INTEGER NOT NULL, -- 4096, 1024, 768
    embedding vector(1024), -- Compatível com HNSW (limite Supabase: 2000 dims); modelos atuais: nv-embedqa-e5-v5 (1024), snowflake/arctic-embed-l (1024)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 7. KNOWLEDGE INGESTIONS & AUDIT
-- Histórico e telemetria das ingestões e reindexações
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.knowledge_ingestions (
    id TEXT PRIMARY KEY,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
    total_files INTEGER NOT NULL DEFAULT 0,
    processed_documents INTEGER NOT NULL DEFAULT 0,
    skipped_documents INTEGER NOT NULL DEFAULT 0,
    created_chunks INTEGER NOT NULL DEFAULT 0,
    generated_embeddings INTEGER NOT NULL DEFAULT 0,
    failed_count INTEGER NOT NULL DEFAULT 0,
    duration_ms INTEGER DEFAULT 0,
    provider_used TEXT,
    model_used TEXT,
    triggered_by TEXT NOT NULL DEFAULT 'SYSTEM_CLI',
    error_message TEXT,
    details JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- ==============================================================================
-- 8. INDEXES & HNSW VECTOR SEARCH ACCELERATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_k_documents_source ON public.knowledge_documents(source_id);
CREATE INDEX IF NOT EXISTS idx_k_documents_type ON public.knowledge_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_k_versions_doc_hash ON public.knowledge_document_versions(document_id, content_hash);
CREATE INDEX IF NOT EXISTS idx_k_chunks_version ON public.knowledge_chunks(document_version_id);
CREATE INDEX IF NOT EXISTS idx_k_chunks_doc ON public.knowledge_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_k_chunks_source ON public.knowledge_chunks(source_id);
CREATE INDEX IF NOT EXISTS idx_k_chunks_article ON public.knowledge_chunks(article_number);
CREATE INDEX IF NOT EXISTS idx_k_chunks_heading ON public.knowledge_chunks(heading);
CREATE INDEX IF NOT EXISTS idx_k_embeddings_chunk ON public.knowledge_embeddings(chunk_id);
CREATE INDEX IF NOT EXISTS idx_k_embeddings_provider_model ON public.knowledge_embeddings(provider, model);

-- HNSW Vector Index para Cosine Similarity
-- Nota: HNSW é preferido para busca semântica em alta dimensão
CREATE INDEX IF NOT EXISTS idx_k_embeddings_vector_hnsw 
ON public.knowledge_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- ==============================================================================
-- 9. CANONICAL VECTOR SEARCH & MATCHING FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION match_knowledge_chunks(
    query_embedding vector,
    match_threshold float DEFAULT 0.45,
    match_count int DEFAULT 20,
    filter_source_id text DEFAULT NULL,
    filter_document_type text DEFAULT NULL,
    filter_jurisdiction text DEFAULT NULL
)
RETURNS TABLE (
    chunk_id text,
    document_id text,
    document_title text,
    document_type text,
    version text,
    source_id text,
    source_name text,
    authority text,
    heading text,
    article_number text,
    content text,
    similarity float,
    metadata jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id AS chunk_id,
        d.id AS document_id,
        d.title AS document_title,
        d.document_type,
        v.version,
        s.id AS source_id,
        s.name AS source_name,
        s.authority,
        c.heading,
        c.article_number,
        c.content,
        1 - (e.embedding <=> query_embedding) AS similarity,
        c.metadata
    FROM public.knowledge_embeddings e
    JOIN public.knowledge_chunks c ON c.id = e.chunk_id
    JOIN public.knowledge_document_versions v ON v.id = c.document_version_id
    JOIN public.knowledge_documents d ON d.id = c.document_id
    JOIN public.knowledge_sources s ON s.id = c.source_id
    WHERE (1 - (e.embedding <=> query_embedding)) >= match_threshold
      AND (filter_source_id IS NULL OR c.source_id = filter_source_id)
      AND (filter_document_type IS NULL OR c.document_type = filter_document_type)
      AND (filter_jurisdiction IS NULL OR c.jurisdiction = filter_jurisdiction)
      AND d.status = 'ACTIVE'
    ORDER BY similarity DESC
    LIMIT match_count;
END;
$$;
