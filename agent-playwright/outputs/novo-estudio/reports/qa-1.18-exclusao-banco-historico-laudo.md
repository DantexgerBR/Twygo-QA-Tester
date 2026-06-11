# Laudo QA 1.18 — Exclusão do Banco Histórico (card 19722, RN 18)

**Data de fechamento**: 11/06/2026 · **Executor**: Dante (via agente QA local)
**Suíte**: "Exclusão do Banco Histórico" — **1 TC** (TC1, Tipo: db, 9 passos/tabelas)
**Ambiente**: Trial 37062 (`novoestudiotrial.stage.twygoead.com`) + MySQL read-only `twygo_db_rc`

## Placar: 0✅ / 1❌ → CARD ❌ Falhou (0 TCs passando)

---

## O que foi executado (E2E completo em 11/06)

Ciclo destrutivo completo na Trial dedicada de QA, conforme apontamento de 10/06:

1. **Curso descartável criado**: event `807899` "QA 1.18 E2E - curso descartavel 1106"
   (form legado; gotchas: react-select "Tipo de experiência" obrigatório; Descrição
   CKEditor só sincroniza via `CKEDITOR.setData`).
2. **Atividade Page criada no Estúdio**: event_content `9295604` ("QA118-GERACAO roteiro").
3. **Geração de IA real disparada** via popover de pendências → linha `roteiro` →
   copiloto enfileirou e **completou** a task (12:58, sem RAG).
4. **Baseline MySQL (pré-exclusão)**: events=6 · event_contents=1 ·
   **ai_generation_tasks=1** (id `5a012859…`, org 37062, scope event 807899,
   target ec 9295604, artifact `roteiro`, status `completed`) · demais tabelas do TC = 0.
5. **Exclusão executada**: Sophia → "Excluir informações" → checkbox **"Todas
   informações (pré-definidas e criadas pelos administradores)"** → Excluir.
   **Comprovado na rede**: `DELETE /api/v1/o/37062/delete_trial_data` → **HTTP 204**.
6. **Reconsulta MySQL (pós-exclusão)**: ver tabela abaixo.

## Resultado por tabela (antes → depois)

| Tabela (datastore REAL) | Antes | Depois | Leitura |
|---|---|---|---|
| events (curso de usuário) | 6 | 5 | ✅ curso 807899 apagado (sobram 5 templates de sistema kinds 7/8/9: Dashboard, Roxo, Aula expositiva, Trilha modular, Pílula de conteúdo) |
| event_contents | 1 | 0 | ✅ atividade 9295604 apagada (cascata ok) |
| **ai_generation_tasks** (MySQL; **não está na AT**) | **1** | **1** | ⚠️ **RETIDA e agora ÓRFÃ** — aponta pra event/event_content que não existem mais |
| activity_summaries (MySQL) | 0 | 0 | sem dado populável (resumo não gerado) — inconclusivo |
| conversations / messages (MySQL) | 0 | 0 | LEGADO — copiloto do Estúdio NÃO escreve aqui (grava DynamoDB); sem dado pra testar |
| studio_generation_partitions (MySQL) | 0 | 0 | vazia GLOBAL — feature não escreve nesta tabela |
| user_course_preferences (MySQL) | — | — | **schema real ≠ AT**: só `user_id, tab_order, last_tab` (sem event/org) — não escopável por org |
| org_generation_preferences | — | — | NÃO existe no MySQL (PostgreSQL) — inacessível read-only |
| studio_checkpoints / messages (DynamoDB) | — | — | inacessível (sem acesso DynamoDB) |

UI pós-exclusão: listagem de Conteúdos vazia ("Não há dados para exibir").

## Veredito TC1: ❌

A asserção do TC ("todos os registros da organização excluída somem das 9 tabelas")
**não é comprovável neste ambiente** e, no escopo comprovável, há um achado contrário
ao espírito do TC:

1. **`ai_generation_tasks` é retida órfã** após a exclusão de dados — é a ÚNICA tabela
   MySQL nova que a feature realmente escreve, e ela não entra na cascata.
   **Linguagem precisa**: não cravamos bug — a retenção pode ser intencional
   (auditoria/billing de consumo de IA: a linha carrega `ai_consumption_id`), e o
   mecanismo executado foi **reset de dados de Trial** (`delete_trial_data`), não
   "exclusão de organização" como descreve o TC. **A alinhar com João/dev**: se a
   intenção é apagar, é retrabalho; se é reter pra auditoria, é correção de AT.
2. 4 tabelas do TC não recebem escrita da feature (legadas/erradas na AT) e 3 estão
   fora do alcance (DynamoDB ×2, PostgreSQL ×1).

## Correções de AT a propor (mapeamento tabela→datastore errado)

- `conversations`/`messages` do copiloto = **DynamoDB** (as MySQL são legado, sem
  escrita desde 2025);
- `org_generation_preferences` = **PostgreSQL** (não está no MySQL);
- `studio_generation_partitions` não recebe escrita (vazia global);
- `user_course_preferences` não tem coluna de evento/org (só preferências de aba por usuário);
- **Falta na AT a `ai_generation_tasks`** (MySQL, org-scoped) — tabela real do log de geração;
- Objetivo do TC diz "MySQL", passos dizem "PostgreSQL" — inconsistente;
- O mecanismo "exclusão de organização" precisa ser especificado (Sophia reset ≠ exclusão de org).

## Evidências

- `qa18-e2e/evidencias-1106/` (28 screenshots: criação do curso, Estúdio, disparo da
  geração, modal Sophia, pós-exclusão)
- `agent-db/evidencias/qa18-tc1-org-scoped-37062-baseline-pre-exclusao-1106.txt`
- `agent-db/evidencias/qa18-ai-generation-tasks-37062-baseline-pre-exclusao-1106.txt`
- `agent-db/evidencias/qa18-tc1-org-scoped-37062-pos-exclusao-1106.txt`
- `agent-db/evidencias/qa18-ai-generation-tasks-37062-pos-exclusao-1106.txt`
- `agent-db/evidencias/qa18-events-restantes-37062-pos-exclusao-1106.txt`
- Scripts: `agent-db/scripts/qa18_*.py` + `twygo-playwright-tests/scripts/qa18_trial_*.py`
