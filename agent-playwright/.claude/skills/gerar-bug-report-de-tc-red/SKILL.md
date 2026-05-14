---
name: gerar-bug-report-de-tc-red
description: Para cada TC que terminou red (failed/timedOut) numa execução Playwright, monta um registro de bug-report estruturado pronto para virar task — Network/Console/payload já coletados pela fixture exploratória + steps/erro/attachments do Playwright + heurísticas para severity/regressão/taxa. Output em `outputs/<slug>/bug-reports.json` + `outputs/<slug>/bug-reports/<test-slug>.md` (um por TC red), prontos pra QA revisar e abrir issue. Use sempre que executar suite/regressivo e quiser que o relatório já entregue bug-reports preenchidos, sem precisar reabrir cada test-artifact manualmente.
version: 1.0.0
---

# gerar-bug-report-de-tc-red

## Quando usar

Após rodar Playwright (`agent:test`, `agent:test:suite`, `agent:test:regression`)
e ter pelo menos 1 TC red em `outputs/<slug>/test-results.json`. Skill orquestra
o agente a montar bug-reports prontos para virar task — antes do QA revisar o
relatório.

**Não use** quando:
- Run inteiro green — não há nada pra reportar.
- TC red foi `fixme` declarado (status `skipped` com `skipKind:'fixme'`) — bloqueio
  conhecido, não bug novo.
- TC red é flaky confirmada via `comparar-chrome-mcp-vs-playwright` — abrir bug
  errado polui o board do dev de produto.

## Pré-condição obrigatória

A skill assume que a fixture exploratória (`src/fixtures/exploratory-fixture.ts`)
**já rodou** durante a execução e gravou:

- `outputs/<slug>/exploratory/<suite-slug>__<test-slug>__w<n>.json` — findings
  passivos por TC (console errors, page errors, HTTP 4xx/5xx, broken images,
  a11y).
- `outputs/<slug>/exploratory-findings.json` — agregação por testsuite.
- `outputs/<slug>/test-results.json` — Playwright JSON reporter (steps, error,
  errorLocation, attachments, duration, status).
- `outputs/<slug>/test-artifacts/<test-folder>/` — screenshots por step, trace.zip,
  error-context.md (quando o Playwright gerou).

Se faltar qualquer um, **pare e informe** o que falta — não invente dados.

## Disparo

Híbrido (fixture já coleta cru; skill orquestra agente pós-run):

1. Run termina, agente verifica `outputs/<slug>/test-results.json`.
2. Para cada `result.status ∈ {failed, timedOut}` E **não** marcado `fixme`/`skip`,
   agente dispara o algoritmo desta skill.
3. Agente grava `bug-reports.json` (estruturado) + 1 `.md` por TC em
   `bug-reports/`.
4. QA abre o `.md`, valida campos `[REVISAR]`, copia pra ferramenta de issue
   (Linear/Jira/GitHub).

## Algoritmo de montagem (por TC red)

Passo-a-passo que o agente segue para cada TC red:

### 1. Coletar dados do Playwright

De `outputs/<slug>/test-results.json` (struct: ver `twygo-report-generator/generator.ts`
linhas 28–80 para os tipos), extrair:

- `testsuite` (do `describe` que envelopa) e `testcase` (do `test()` title).
- `file` (path do .spec.ts).
- `status` + `duration`.
- `error.message` + `error.stack` (mensagem exata, **quoted**).
- `errorLocation` (file:line:col onde quebrou).
- `steps[]` — lista plana de steps com `title`, `duration`, `status`, `errorMessage`
  no step que quebrou. Identificar **qual step XML** travou (substring `step-NN`
  ou Allure step name).
- `attachments[]` — screenshots (`step-NN-*.png`, `test-failed-N.png`), trace,
  error-context. Manter os `path` originais (não copiar — twygo-report-generator
  arquiva em `<reportDir>/artifacts/`).

### 2. Coletar dados da fixture exploratória

De `outputs/<slug>/exploratory/<suite-slug>__<test-slug>__w<n>.json`:

- Filtrar `findings[]` com `kind ∈ {http_error, console_error, page_error}` que
  ocorreram **antes** do `error` do Playwright (compará timestamps quando
  presentes; senão pegar todos do TC).
- Para cada `http_error`: extrair `url`, `detail.status`, `detail.method`,
  `message`. Se houver `response.body` no detail, incluir (geralmente backend
  Twygo retorna PT-BR útil — ex: `"Descrição não pode ficar vazio(a)"`).
- Para cada `console_error`/`page_error`: extrair `message` + URL onde ocorreu.

### 3. Coletar contexto de ambiente

De `projects/<slug>/project.config.json` + `config/environment.json`:

- `environment` declarado pelo projeto (ex: `staging-widgets`).
- `baseUrl` resolvido (`widgets.stage.twygoead.com`).
- `orgId` do env (ex: `36988`).
- Usuário de teste (email do `.env`, **não senha**).
- Browser + versão (`projectName` do test-results: `chromium`, `firefox`, `webkit`).
- Run timestamp (`outputs/<slug>/playwright-summary.md` ou stat do
  `test-results.json`).

### 4. Inferir campos não-Playwright (com [REVISAR])

Defaults seguros + tag para QA reabrir:

| Campo | Heurística agente | Tag |
|---|---|---|
| **Severity** | `error.message` contém "500" / "Internal Server" → **alta**. 422/400 backend → **média**. Asserção UI sem erro 5xx → **média**. Click-not-actionable + sem 5xx → **baixa**. | `[REVISAR severity]` |
| **Taxa de reprodução** | Sempre `1/1 nesta execução` (1 run = 1 amostra). Se houver `retries > 1` no test-results, mostrar `N/M`. | `[REVISAR taxa real — rodar 3+ vezes]` |
| **Regressão?** | Roda `git log --oneline --since="<lastGreenDate>" -- <fileLabel>` se houver report verde anterior. Sem baseline → `desconhecida`. | `[REVISAR regressão]` |
| **Impacto** | `desconhecido — usuário valida` | `[REVISAR impacto]` |
| **Reproduz em outro usuário/org?** | `não testado` | `[REVISAR isolamento]` |
| **Workaround** | `nenhum identificado` | `[REVISAR workaround]` |

**Não chutar**. Tudo que não vem de fonte determinística leva `[REVISAR <campo>]`.

### 5. Triagem automática: bug-produto vs spec-frágil

Antes de classificar como bug, agente roda heurística de [`auto-auditar-fails-via-devtools`](../auto-auditar-fails-via-devtools/SKILL.md):

- Existe HTTP 5xx in-scope do TC? → **provável bug produto** (alta confiança).
- Existe HTTP 4xx in-scope com response body PT-BR? → **provável bug produto** (média).
- Erro "Timeout exceeded" + sem HTTP 5xx + screenshot mostra UI normal → **suspeita
  spec-frágil**; campo `Categoria sugerida: spec-frágil [REVISAR via chrome-mcp]`.
- Erro "click intercepted by ..." → **suspeita modal não tratado**; sugerir
  [`fechar-modais-twygo`](../fechar-modais-twygo/SKILL.md).
- Erro "strict mode violation" / "resolved to N elements" → **spec-frágil seletor**;
  não é bug produto.

Campo `Categoria sugerida` no MD final permite QA filtrar bugs-produto antes de
abrir N tasks erradas.

### 6. Escrever output

**Arquivo estruturado**: `outputs/<slug>/bug-reports.json`

```jsonc
{
  "generatedAt": "ISO-8601",
  "project": "<slug>",
  "runMode": "per-suite|all-suites|regression",
  "totalRed": 5,
  "reports": [
    {
      "id": "<suite-slug>__<test-slug>__w0",
      "title": "<testcase title> — <error short>",
      "testsuite": "...",
      "testcase": "...",
      "file": "projects/<slug>/tests/features/.../*.spec.ts",
      "status": "failed|timedOut",
      "durationMs": 30021,
      "categoriaSugerida": "bug-produto|spec-fragil|modal-nao-tratado|flakiness|inconclusivo",
      "categoriaConfianca": "alta|media|baixa",
      "severity": "alta|media|baixa",
      "severityRevisar": true,
      "environment": {
        "name": "staging-widgets",
        "baseUrl": "https://widgets.stage.twygoead.com",
        "orgId": 36988,
        "browser": "chromium",
        "browserVersion": "...",
        "user": "evertongambeta@gmail.com"
      },
      "reproSteps": [
        { "n": 1, "action": "Acessar a aba Painéis em Configurações > Menu", "status": "passed" },
        { "n": 2, "action": "Clicar em Ativar/Inativar do painel X", "status": "failed", "errorAtStep": true }
      ],
      "expected": "<do XML — step.expectedresults>",
      "observed": "<error.message quoted>",
      "errorLocation": "file:line:col",
      "network": [
        {
          "method": "PATCH",
          "url": "/o/36988/panels/123/change_status",
          "status": 422,
          "responseBody": "Descrição não pode ficar vazio(a)",
          "inScope": true
        }
      ],
      "console": [
        { "level": "error", "message": "...", "url": "..." }
      ],
      "attachments": [
        { "name": "step-02", "relPath": "test-artifacts/.../step-02.png" },
        { "name": "trace", "relPath": "test-artifacts/.../trace.zip" }
      ],
      "taxaReproducao": "1/1 nesta execução",
      "taxaRevisar": true,
      "regressao": "desconhecida",
      "regressaoRevisar": true,
      "impacto": "desconhecido",
      "impactoRevisar": true,
      "isolamento": { "outroUsuario": null, "outraOrg": null, "revisar": true },
      "workaround": null,
      "ids": { "panelId": "...", "useModeId": "...", "userId": "..." }
    }
  ]
}
```

**Arquivo legível por TC**: `outputs/<slug>/bug-reports/<id>.md` — template:

```markdown
# [<categoriaSugerida>] <testcase title>

> _Run: <runMode> — <ISO-8601> — confiança da categoria: <alta|media|baixa>_

## Identificação
- **Suite**: <testsuite>
- **TC**: <testcase>
- **Spec**: `<file>:<errorLocation.line>`

## Ambiente
- **Env**: <name> (`<baseUrl>`)
- **OrgId**: <orgId>
- **Usuário**: <email>
- **Browser**: <browser> <browserVersion>
- **Build/commit**: <git rev-parse HEAD do agent-playwright>
- **Data/hora**: <ISO-8601>

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`,
  org <orgId>, perfil Administrador.
- **Passo-a-passo**:
  1. <reproSteps[0].action> — ✅ passed
  2. <reproSteps[1].action> — ❌ **falhou aqui**
  3. ...
- **Taxa**: <taxaReproducao> `[REVISAR taxa real]`

## Comportamento
- **Esperado**: <expected>
- **Observado**: `<error.message>`

## Evidência técnica

### Network (in-scope)
| Método | URL | Status | Body |
|---|---|---|---|
| PATCH | /o/36988/panels/123/change_status | **422** | `Descrição não pode ficar vazio(a)` |

### Console
- `error`: ...

### Attachments
- ![step-02](./test-artifacts/.../step-02.png)
- [trace.zip](./test-artifacts/.../trace.zip) — abrir com `npx playwright show-trace`
- [error-context.md](./test-artifacts/.../error-context.md)

### IDs envolvidos
- panelId: <...>
- useModeId: <...>

## Escopo
- **Reproduz em outro usuário?** `[REVISAR isolamento]`
- **Reproduz em outro env?** `[REVISAR isolamento]`
- **Regressão?** <regressao> `[REVISAR regressão]`
- **Workaround**: <workaround> `[REVISAR workaround]`

## Impacto
- **Severity sugerida**: <severity> `[REVISAR severity]`
- **Impacto qualitativo**: <impacto> `[REVISAR impacto]`

---

> _Gerado por `gerar-bug-report-de-tc-red` v1.0.0. Campos `[REVISAR]` exigem
> validação humana antes de abrir task._
```

## Anti-patterns

### A. Não inventar campos faltantes
Se `error.message` está vazio (raro mas possível em timeouts mudo), **não** fabricar
mensagem. Use `"<sem mensagem — checar trace.zip>"` literal e tag `[REVISAR observado]`.

### B. Não classificar como bug-produto sem evidência
Sem HTTP 5xx/4xx in-scope e sem stacktrace de produto, `categoriaSugerida` =
`inconclusivo`. Forçar `bug-produto` em falha de seletor enche o board do dev
com não-bug.

### C. Não duplicar dados que `twygo-report-generator` já agrega
Bug-report **não** substitui o `tests.md` do report. Foco do bug-report é
"pacote pronto pra virar issue" — campos extras (severity, impacto, regressão)
que o relatório técnico não cobre.

### D. Não copiar arquivos de attachment para `bug-reports/`
Manter `relPath` apontando para `test-artifacts/<test-folder>/` original. Quando
`twygo-report-generator` rodar, ele arquiva em `<reportDir>/artifacts/` (regra do
[`feedback_archive_artifacts_in_report.md`](../../../memory/feedback_archive_artifacts_in_report.md)).
Duplicar agora gera arquivos órfãos.

### E. Não disparar para `skipped`/`fixme`
`status: skipped` ou `skipKind ∈ {fixme, skip}` significa bloqueio conhecido
ou XML desatualizado — não é bug novo. Filtrar antes de processar.

### F. Não consumir `exploratory-findings.json` (agregado) — usar `exploratory/<file>.json` (por TC)
O agregado tem totais; o por-TC tem findings individuais com URL, body, severity.
Bug-report precisa do detalhe.

## Integração com twygo-report-generator

Integrado desde 2026-05-14. Fluxo no orchestrator:

1. **Fase 5.5** — `twygo-exploratory-validator` agrega findings.
2. **Fase 5.7** — esta skill: lê `test-results.json` + `exploratory/*.json`,
   grava `outputs/<slug>/bug-reports.json` + `outputs/<slug>/bug-reports/<id>.md`.
3. **Fase 6** — `twygo-report-generator` lê `bug-reports.json`, filtra pelas
   testsuites do scope, **copia os MDs pra dentro de `<reportDir>/bug-reports/`**
   (self-contained, igual ao `archiveAttachments`), e renderiza seção
   `## Bug Reports prontos pra task` no `index.md` com tabela `TC | Categoria
   | Confiança | Severity | Justificativa` linkando cada MD.

Skip individual: `npm run agent:run -- --no-bug-reports` (orchestrator flag) ou
gerar isolado via `npm run agent:bug-reports`.

## Trigger manual

Quando agente não disparar automaticamente, QA invoca:

```
"gera bug-reports da última run em outputs/<slug>"
```

Agente lê test-results.json + exploratory/* + project.config.json e produz os
arquivos. Não precisa MCP, não precisa browser — pura leitura + grava.

## Validação da skill

Critério "skill funcionou":

- [ ] Cada TC red gerou 1 entrada em `bug-reports.json` E 1 `.md`.
- [ ] Nenhum TC `fixme`/`skipped` gerou bug-report.
- [ ] Campos `[REVISAR]` aparecem visíveis (não escondidos em JSON).
- [ ] Network in-scope listado quando existe (regra de `debugar-via-network-e-console`).
- [ ] `categoriaSugerida` tem confiança declarada.
- [ ] Attachments por relPath, não duplicados.
- [ ] QA consegue copiar 1 MD → ferramenta de issue → tem >80% do conteúdo necessário.

## Casos vivenciados (até 2026-05-13)

- **TC widgets `ativar-inativar-painel/inativar-painel-associado.spec.ts` red por 422 backend** —
  `change_status` retornou `"Descrição não pode ficar vazio(a)"` por bug do servidor
  (`title_for#NoMethodError` em `linked_menus`). Bug-report deveria capturar
  Network direto e marcar `categoriaSugerida: bug-produto, confiança: alta`. Sem
  essa skill, QA gastou 1h re-investigando do zero. Memory:
  [`bug_title_for_linked_menus.md`](../../../memory/bug_title_for_linked_menus.md).

- **Suite paineis-joao 31 fails "click não acionável"** —
  padrão de spec-frágil (modal interceptou ou wait timing). `categoriaSugerida:
  spec-fragil` evitaria abrir 31 tasks de bug-produto.

## Relação com outras skills

- [`debugar-via-network-e-console`](../debugar-via-network-e-console/SKILL.md) — fonte do ritual de coleta Network.
- [`auto-auditar-fails-via-devtools`](../auto-auditar-fails-via-devtools/SKILL.md) — heurística de bug-produto vs spec-frágil.
- [`comparar-chrome-mcp-vs-playwright`](../comparar-chrome-mcp-vs-playwright/SKILL.md) — passo seguinte quando `categoriaSugerida: spec-fragil` (auditoria via humano-real).
- [`twygo-triage-report`](../twygo-triage-report/SKILL.md) — relacionado mas diferente: triage-report é decisão em lote para o **QA** escolher (bug/expected/spec/flaky). bug-report é pacote pronto pra **dev** receber, já filtrado.
- [`twygo-report-generator`](../twygo-report-generator/SKILL.md) — consumidor futuro (link no index.md).
