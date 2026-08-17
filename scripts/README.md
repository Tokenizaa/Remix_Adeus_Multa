# Sincronização Contínua DOU para CONTRAN e SENATRAN

Este script implementa um mecanismo de verificação periódica para detectar novas resoluções do CONTRAN e portarias do SENATRAN publicadas nos sites oficiais do Ministério dos Transportes.

## Localização
`scripts/dou_sync.py`

## Requisitos
- Python 3.x
- Bibliotecas padrão do Python (nenhuma dependência externa necessária na versão atual)

## Como usar
1. Execute o script manualmente:
   ```bash
   python3 scripts/dou_sync.py
   ```

2. Para automação, configure um cron job (executar diariamente, por exemplo):
   ```bash
   0 9 * * * /usr/bin/python3 /caminho/para/Remix_AdeusMultas/scripts/dou_sync.py
   ```

## Funcionalidades Atuais
- Verifica as páginas de resoluções CONTRAN e portarias SENATRAN
- Extrai links para PDFs
- Tenta extrair número e ano dos arquivos PDF
- Compara com as entradas existentes nos arquivos JSON
- Relatório de novas publicações encontradas

## Limitações Atuais
- As páginas podem carregar conteúdo via JavaScript, o que pode impedir a extração de links na versão atual que usa apenas bibliotecas padrão.
- A extração completa de metadados (ementa, data de publicação, etc.) ainda não está implementada - o script atualmente apenas detecta novos PDFs com base no número e ano.

## Próximos Passos para Melhoria
1. Implementar extração de metadados a partir das páginas de listagem ou dos PDFs
2. Lidar com conteúdo renderizado por JavaScript (possivelmente usando uma abordagem headless browser ou encontrando APIs alternativas)
3. Integrar atualização automática dos arquivos JSON quando metadados completos estiverem disponíveis
4. Adicionar tratamento de erros e logging mais robusto

## Arquivos Relacionados
- `knowledge/legislation/resolutions/contran.json` - Base de resoluções CONTRAN
- `knowledge/legislation/ordinances/senatran.json` - Base de portarias SENATRAN
- `knowledge/reports/collection-report.json` - Relatório de coleta e validação

## Nota Importante
Este script foi desenvolvido como parte da Fase 4 do plano de aquisição de conhecimento jurídico do DefesAi. Após a implementação completa desta fase, prossiga para a Fase 5: auditoria dos templates de defesa contra as redações vigentes.