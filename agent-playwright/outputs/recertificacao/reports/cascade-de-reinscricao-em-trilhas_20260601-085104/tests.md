# Casos de teste — Recertificação

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Cascade de Reinscrição em Trilhas

_4 caso(s) — 0 aprovado(s), 0 falha(s), 4 ignorado(s)_

### ⊘ Ignorado · TC1 — Reinscrever trilha individualmente cria participants nos cursos filhos com recertification_number correto por curso 

<a id="tc1-reinscrever-trilha-individualmente-cria-participants-nos-cursos-filhos-com-recertification-number-correto-por-curso"></a>_Arquivo:_ `tc1-reinscrever-trilha-cria-participants-filhos.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer validação de worker AddParticipantToLearningPath + DB-pure de recertification_number por curso filho. UI cobre só dispatch. Validar manualmente via Sidekiq monitor + psql.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** requer validação de worker AddParticipantToLearningPath + DB-pure de recertification_number por curso filho. UI cobre só dispatch. Validar manualmente via Sidekiq monitor + psql.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC2 · Filtro "já inscrito" é bypassado em fluxos de reinscrição (cria segunda/N-ésima inscrição) · 🔴 Crítico

<a id="tc2-filtro-ja-inscrito-e-bypassado-em-fluxos-de-reinscricao-cria-segunda-n-esima-inscricao"></a>_Arquivo:_ `tc2-filtro-ja-inscrito-bypassado-fluxo-reinscricao.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): requer validação DB-pure de filter bypass + presença de N inscrições com recertification_number distintos. Validar manualmente.

**Sumário (objetivo do caso):** Validar que cascade não bloqueia o aluno mesmo que ele já tenha participant em algum curso filho (RN 18.2).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Trilha "Trilha Reinscrição w{workerIndex}" com `has_recertification = true` e 3 cursos filhos vinculados
Pelo menos 2 alunos elegíveis na trilha
Sidekiq operacional (worker `AddParticipantToLearningPath`)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Pré-condição: aluno com participant ativo em 2 dos 3 cursos filhos da trilha, e sem participant no 3º. | Estado preparado. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer validação DB-pure de filter bypass + presença de N inscrições com recertification_number distintos. Validar manualmente. | — |
| 2 | Reinscrever o aluno na trilha pelo fluxo do TC1 | Worker processa. | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer validação DB-pure de filter bypass + presença de N inscrições com recertification_number distintos. Validar manualmente. | — |
| 3 | Acessar a lista de aprendizagem de cada um dos 3 cursos filhos em "/learning_students?event_id={cursoFilhoId}" | Aluno aparece nos 3 cursos com `recertification_number > 0` (mesmo nos 2 onde já estava inscrito antes — filtro `event_and_user_id_subscribed` bypassado). | ⊘ | Step não executado — Marcado para revisão (test.fixme): requer validação DB-pure de filter bypass + presença de N inscrições com recertification_number distintos. Validar manualmente. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo declarado pelo spec:** requer validação DB-pure de filter bypass + presença de N inscrições com recertification_number distintos. Validar manualmente.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Trilha "Trilha Reinscrição w{workerIndex}" com `has_recertification = true` e 3 cursos filhos vinculados
1. Pré: Pelo menos 2 alunos elegíveis na trilha
1. Pré: Sidekiq operacional (worker `AddParticipantToLearningPath`)
1. 1. Pré-condição: aluno com participant ativo em 2 dos 3 cursos filhos da trilha, e sem participant no 3º.
1. 2. Reinscrever o aluno na trilha pelo fluxo do TC1
1. 3. Acessar a lista de aprendizagem de cada um dos 3 cursos filhos em "/learning_students?event_id={cursoFilhoId}"

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC3 — Cascade NÃO acontece em inscrição original (sem recertification) — regressão crítica 

<a id="tc3-cascade-nao-acontece-em-inscricao-original-sem-recertification-regressao-critica"></a>_Arquivo:_ `tc3-cascade-nao-acontece-inscricao-original-regressao.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): regressão DB-pure — exige validação direta no banco que recertification_number=0 nos filhos. Validar manualmente.

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

_Sem steps Allure ou metadata XML para este testcase._

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** —
- **Motivo declarado pelo spec:** regressão DB-pure — exige validação direta no banco que recertification_number=0 nos filhos. Validar manualmente.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. — (sem steps documentados no XML)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ⊘ Ignorado · TC4 · Cascade síncrona inline no fluxo CSV · 🟡 Normal

<a id="tc4-cascade-sincrona-inline-no-fluxo-csv"></a>_Arquivo:_ `tc4-cascade-sincrona-inline-fluxo-csv.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): cross-suite com Suite 04 (CSV) + cascade DB. Compound test — validar manualmente após Suite 04 estar verde + DB checks.

**Sumário (objetivo do caso):** Validar que para importação CSV em trilha, o cascade para cursos filhos é executado SÍNCRONO inline dentro do worker do CSV (RN 18 — `LearningPathActionMassService#create_course_participants`).

**Pré-condições:**

```
Feature flag `:recertificacao` ATIVA
Trilha "Trilha Reinscrição w{workerIndex}" com `has_recertification = true` e 3 cursos filhos vinculados
Pelo menos 2 alunos elegíveis na trilha
Sidekiq operacional (worker `AddParticipantToLearningPath`)
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Preparar CSV com 1 linha contendo email de aluno existente, trilha destino e `Reinscrever=SIM` | CSV criado. | ⊘ | Step não executado — Marcado para revisão (test.fixme): cross-suite com Suite 04 (CSV) + cascade DB. Compound test — validar manualmente após Suite 04 estar verde + DB checks. | — |
| 2 | Fazer upload do CSV pela tela de importação da trilha | Worker `CsvImportEventParticipantWorker` processa. | ⊘ | Step não executado — Marcado para revisão (test.fixme): cross-suite com Suite 04 (CSV) + cascade DB. Compound test — validar manualmente após Suite 04 estar verde + DB checks. | — |
| 3 | Inspecionar listagem dos 3 cursos filhos IMEDIATAMENTE após o worker concluir | Aluno aparece nos 3 cursos filhos com `recertification_number > 0` (cascade já completou — síncrono inline, sem job adicional). | ⊘ | Step não executado — Marcado para revisão (test.fixme): cross-suite com Suite 04 (CSV) + cascade DB. Compound test — validar manualmente após Suite 04 estar verde + DB checks. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Normal
- **Motivo declarado pelo spec:** cross-suite com Suite 04 (CSV) + cascade DB. Compound test — validar manualmente após Suite 04 estar verde + DB checks.
- **Categoria:** _não declarada_ — pra próxima revisão, ajustar o spec para `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario).

**Roteiro do XML (para validação manual):**
1. Pré: Feature flag `:recertificacao` ATIVA
1. Pré: Trilha "Trilha Reinscrição w{workerIndex}" com `has_recertification = true` e 3 cursos filhos vinculados
1. Pré: Pelo menos 2 alunos elegíveis na trilha
1. Pré: Sidekiq operacional (worker `AddParticipantToLearningPath`)
1. 1. Preparar CSV com 1 linha contendo email de aluno existente, trilha destino e `Reinscrever=SIM`
1. 2. Fazer upload do CSV pela tela de importação da trilha
1. 3. Inspecionar listagem dos 3 cursos filhos IMEDIATAMENTE após o worker concluir

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---
