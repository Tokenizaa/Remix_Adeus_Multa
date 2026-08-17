# AGENTS.md - Manifesto Vivo com Topologia de Agentes Ativos

Este documento define a topologia de agentes ativos no projeto Adeus Multa, conforme descoberto pelo pipeline de descoberta.

## Agentes de Domínio

| Agente | Domínio | Responsabilidades |
|--------|---------|-------------------|
| @admin-agent | Administration | Painel administrativo central, gestão de casos, pagamentos, usuários, contas sociais, auditoria de operações, métricas de negócio |
| @marketing-agent | Marketing | Planejamento editorial, execução de marketing, calendário de conteúdo, posts para redes sociais, criativos, métricas e campanhas, SEO on-page e AI search visibility |
| @backend-agent | Backend | Rotas, serviços, autenticação, middleware, validação, lógica de negócio |
| @frontend-agent | Frontend | Componentes, estado, roteamento, estilos, integração com APIs |
| @banco-agent | Banco de Dados | Schema, queries, migrations, índices, modelagem |
| @testes-agent | Testes | Qualidade e testes — unitários, integração, E2E, performance |
| @qualidade-agent | Qualidade | Revisão de PRs, validação de arquitetura, auditoria de qualidade |
| @documentacao-agent | Documentação | Criação e manutenção de ADRs, sincronização de folder-structure, registro de topologia de agentes, atualização de roadmap e decision-log |
| @evolution-api-agent | WhatsApp Integration | Integração WhatsApp via Evolution API — instâncias, envio de mensagens, webhooks, grupos, chatbot |
| @scraper-agent | Web Scraping | Scraping e extração de dados web — pesquisa profunda, mercado, concorrentes, leads, SEO |
| @gov-loop-orchestrator-agent | Loop Engineering | Orquestração de sessões de loop de engenharia de features com governança (maker/checker, gates por fase, hash-check, checkpoint humano) |

## Agentes de Governança (Sempre Presentes)

- @architecture-review-agent: Revisão de arquitetura, validação de SOLID, acoplamento, performance
- @context-agent: Documentação viva, ADRs, folder-structure, roadmap, decision-log

## Matriz de Acesso

Os agentes devem respeitar as seguintes fronteiras de acesso:
- Os agentes de domínio podem acessar código em seus respectivos diretórios
- Agentes de governança têm acesso global para fins de revisão e documentação
- Acesso a shared kernel requer ADR e aprovação do @supervisor
- Mudanças em contratos públicos exigem ADR

## Código de Propriedade

Veja `.github/CODEOWNERS` para detalhes de propriedade de arquivos por agente.

## Última Atualização

Este arquivo foi gerado automaticamente pelo pipeline de descoberta em [DATA_ATUAL].