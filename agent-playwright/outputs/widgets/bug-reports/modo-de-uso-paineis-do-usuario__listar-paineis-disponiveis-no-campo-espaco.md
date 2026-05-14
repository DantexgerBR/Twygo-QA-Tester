# [spec-fragil/data-stale] Listar painéis disponíveis no campo 'Espaço'

> _Categoria recategorizada manualmente: **spec-fragil/data-stale** (confiança alta) — validada ao vivo via chrome-devtools-mcp em 2026-05-14, **mesma causa do TC1 desta suite**. Dado hardcoded `knownActivePanelName: 'Painel Aluno'` em `listar-paineis-campo-espaco.data.ts:3` referencia um painel que NÃO EXISTE no env staging-widgets. Dropdown só lista `Painel 1..10`. UI funciona corretamente._
> _Gerado em 2026-05-14T15:09:41.190Z · commit 13a7918 · revisado 2026-05-14_

## Identificação
- **Suite**: Modo de uso - Painéis do usuário
- **TC**: Listar painéis disponíveis no campo 'Espaço'
- **Spec**: `projects/widgets/tests/features/modo-de-uso-paineis-do-usuario/listar-paineis-campo-espaco.spec.ts`
- **Erro em**: `C:\Claude\Widgets\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\modo-de-uso-paineis-do-usuario\listar-paineis-campo-espaco.spec.ts:52:78`
- **Status**: failed (14737ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: 13a7918

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Setup — navegar ao form de novo item de menu — ✅
  2. 2. Selecionar 'Painéis do usuário' no Modelo de página → campo Espaço aparece — ✅
  3. 3. Abrir dropdown e validar opções (painel ativo aparece, inativos não) — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: O dropdown "Espaço" deve listar pelo menos um painel ATIVO conhecido (`knownActivePanelName === 'Painel Aluno'`). Asserção do spec linha 52: `expect(optionTexts.some(t => t.includes(data.knownActivePanelName))).toBe(true)`.
- **Observado (UI)**: Dropdown abre corretamente, lista 10 painéis (`Painel 1..10`), live region anuncia "10 results available." — comportamento de produto correto.
- **Observado (spec)**: A asserção `optionTexts.some(t => t.includes('Painel Aluno'))` retorna `false` porque "Painel Aluno" não está entre as 10 opções. `expect(false).toBe(true)` falha.
  ```
  Error: expect(received).toBe(expected) // Object.is equality
  Expected: true
  Received: false
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![step-01-1-Setup-navegar-ao-form-de-novo-item-de-menu](../test-artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/attachments/step-01-1-Setup-navegar-ao-form-de-novo-item-de-menu-5e51d1739ffd5c1cc1422eb4267644bc328dfea2.png)
- ![step-02-2-Selecionar-Pain-is-do-usu-rio-no-Modelo-de-p-gina-campo-Es](../test-artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/attachments/step-02-2-Selecionar-Pain-is-do-usu-rio-no-Modelo-de-p-gina-campo-Es-dc0e5fc5c00ee4b534fea0a169c83c68cff40496.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/video.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/trace.zip)

### IDs envolvidos
- orgId: 36988
- useModeId: 70077

### Validação chrome-mcp (2026-05-14)

Mesma sessão chrome-mcp do TC1 desta suite — investigação compartilhada:

1. `/o/36988/use_modes/70077/use_mode_itens/new`
2. Selecionar "Painéis do usuário" → campo Espaço aparece
3. Abrir combobox de Espaço → 10 painéis listados: `Painel 1..10`. Nenhum chamado "Painel Aluno"

A live region do react-select anunciou `"10 results available."` — confirmando que o backend RETORNA 10 painéis ativos, mas nenhum bate com o nome hardcoded no spec.

### Fix sugerido

Mesmo do TC1 (compartilhado): trocar `knownActivePanelName: 'Painel Aluno'` por nome real do env, ou refatorar pra resolver dinamicamente (asserção por invariante "tem pelo menos 1 painel ATIVO listado" em vez de "tem nome específico"). Detalhamento das 3 opções no bug-report do TC1.

## Escopo
- **Reproduz em outro usuário?** Sim — nome hardcoded no spec, qualquer usuário falha igual
- **Reproduz em outro env?** Provável que sim em qualquer env Twygo sem painel "Painel Aluno"
- **Regressão?** Provável bug-de-dado introduzido no spec
- **Workaround**: trocar nome pelo de um painel existente

## Impacto
- **Severity sugerida**: **baixa** — spec frágil, fix trivial (1 linha em `.data.ts`)
- **Impacto qualitativo**: spec não cobre validação "dropdown lista painéis ativos" até o fix

## Destinatário sugerido
**QA / autor do spec** — fix em 1 linha em `*.data.ts`. Aproveitar pra refatorar TC1+TC2 desta suite juntos (mesma data-staleness) numa skill nova `seed-de-paineis-no-staging-widgets` ou refactor pra invariante dinâmica.

---

> _Gerado por `gerar-bug-report-de-tc-red` v1.0.0. Campos `[REVISAR]` exigem validação humana antes de abrir task._