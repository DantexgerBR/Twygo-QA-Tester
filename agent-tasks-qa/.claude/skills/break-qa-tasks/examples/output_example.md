# Exemplo de Output — Resumo apresentado ao usuário

> Esperado ao final da execução de `/break-qa-tasks` no exemplo de [input_example.md](input_example.md).

## Quebra de QA — Base de Conhecimento (IA) Fase 01

| # | Tipo | Título | Esforço (h) |
|---|------|--------|-------------|
| 1 | Análise de testes | Análise de testes | 12 |
| 2 | Execução de testes | QA 1.1 - Listagem de bases de conhecimento | 4 |
| 3 | Execução de testes | QA 1.2 - Filtros da listagem | 3 |
| 4 | Execução de testes | QA 2.1 - Cadastro de base — aba Identificação | 6 |
| 5 | Execução de testes | QA 2.2 - Cadastro de base — aba Documentos | 8 |
| 6 | Execução de testes | QA 2.3 - Indexação de Documentos (Files Ingestor) | 6 |
| 7 | Execução de testes | QA 3.1 - Logs de indexação | 2 |
| 8 | Execução de testes | QA 4.1 - Banco Histórico (Bases de Conhecimento) | 2 |
| 9 | Execução de testes | QA x.x - Feature flag | 3 |
| 10 | Execução de testes | QA x.x - Ambientes adicionais | 4 |
| 11 | Deploy | Gerar versão para Deploy (dd/mm) | 1 |

**Totais:**
- Análise: 12h
- Execução: 38h (9 atividades)
- Deploy: 1h
- **Total estimado de QA: 51h**

**Atividades sem estimativa (cerimoniais):**
- Reteste — Repasse
- Documentação — Usabilidade
- Documentação — Vídeo
- Indiretos - Cerimonias da Equipe — Review

**Alertas:**
- ⚠️ Atividade Dev 4.1 (Banco histórico) sem documentação detalhada das tabelas impactadas no momento — solicitar ao Dev antes da execução dos testes.
- ✅ Aba `produto` da planilha contém `account_id` e `folder_id` válidos.

**Arquivos gerados:**
- `projects/base-de-conhecimento/output/QA_Atividades_Base_de_Conhecimento_IA_Fase_01_Complementada.xlsx`
- `projects/base-de-conhecimento/output/QA_Only_Base_de_Conhecimento_IA_Fase_01.xlsx`

---

## Detalhe de uma atividade gerada (exemplo)

### QA 2.3 - Indexação de Documentos (Files Ingestor)

**Tipo:** Execução de testes
**Esforço estimado:** 6h
**Descrição:**

```
Relacionado a: Dev 2.3
RNs: RN 4

Validar:
* Worker FilesIngestorJob é disparado ao salvar uma base com documentos
* Mock do banco vetorial (Pinecone) responde corretamente em ambiente de teste
* Indexação de arquivos PDF, DOCX e TXT — todos os formatos suportados
* Registro de progresso da indexação visível na UI (status "Em indexação" → "Concluído")
* Tratamento de erro quando o banco vetorial retorna falha — status muda para "Erro" + retry
* Limite de 50MB por arquivo bloqueia upload com mensagem literal
* Limite de 100 arquivos por base bloqueia novo upload
```

---

## Observação sobre calibração de estimativas

Antes de fixar as horas acima, o agente leu `../agent-playwright/src/` e identificou:

- ✅ Page object de listagem genérico em `src/pages/ListPage.ts` → QA 1.1 ajustado para 4h (em vez de 8h)
- ✅ Fixture de feature flag em `src/fixtures/feature-flag.ts` → QA x.x Feature flag ajustado para 3h (em vez de 4h)
- ⚠️ Nenhum helper para mock de banco vetorial → QA 2.3 mantido em 6h (sem reduzir)
- ⚠️ Nenhum helper para queries em `ai_indexing_logs` → QA 3.1 mantido em 2h

Esse ajuste explica por que estimativas finais podem divergir da tabela base do CLAUDE.md.
