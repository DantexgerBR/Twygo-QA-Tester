# Catálogo de retrofit — cleanup de dados de teste (widgets)

**Data**: 2026-05-14
**Branch**: `project/paineis-dos-usuarios-widgets-joao`
**Total specs**: ~140 em `projects/widgets/tests/features/`
**Total a retrofit**: **56 specs**
**Cobertura atual**: ~21% (30/140 specs com `afterAll`/`afterEach`)
**Cobertura alvo pós-retrofit**: **100%** dos specs que criam estado persistente

Referência operacional: skill [`limpar-dados-de-teste-twygo`](../../.claude/skills/limpar-dados-de-teste-twygo/SKILL.md) e CLAUDE.md §7.6 Anti-pattern G.

---

## Tabela mestra — todas as 22 suites

| Suite | Specs total | Cria estado | Já com cleanup | Retrofit pendente | Tipo cleanup |
|---|---|---|---|---|---|
| `adicionar-editar-aba` | 18 | 16 | 0 | **16** | `deletePanelByNameSafe` |
| `layout-das-abas` | 11 | 11 | 0 | **11** | `deletePanelByNameSafe` |
| `importar-abas` | 11 | 11 | 0 | **11** | `deletePanelByNameSafe` (×1-2) |
| `adicionar-widgets` | 10 | 10 | 0 | **10** | `deletePanelByNameSafe` (arrasta widgets) |
| `editar-excluir-widgets` | 6 | 6 | 0 | **6** | `deletePanelByNameSafe` (arrasta widgets) |
| `mobile` | 5 | 1 | 0 | **1** | `deletePanelByNameSafe` |
| `modo-de-uso-paineis-do-usuario` | 3 | 2 | 1 | **1** | `disassociate_safe` → `deletePanelByNameSafe` |
| `pesquisa-e-filtros` | 9 | 1 | 1 | 0 | toggle reverso (idempotente) |
| `ativar-inativar-painel` | 5 | 4 | 4 | 0 | — |
| `duplicar-paineis` | 6 | 6 | 6 | 0 | — |
| `listagem-de-paineis` | 8 | 0 | n/a | 0 | read-only |
| `logs` | 9 | 0 | n/a | 0 | read-only (consulta painel admin) |
| `feature-flag` | 5 | 0 | n/a | 0 | mock via `page.route` ou read-only |
| `dashboard-visao-do-aluno` | 8 | 0 | n/a | 0 | read-only (visão aluno) |
| `beta-launch` | 4 | 0 | n/a | 0 | mock contrato ou read-only |
| `trial` | 4 | 0 | n/a | 0 | env trial isolado (descartável) |
| `banco-historico` | 3 | 0 | n/a | 0 | worker DB validation |
| `worker-migracao-de-paineis` | 3 | 0 | n/a | 0 | worker DB validation |
| `worker-reversao` | 3 | 0 | n/a | 0 | worker DB validation |
| `ambientes-adicionais` | 3 | 0 | n/a | 0 | read-only |

**TOTAL retrofit**: **56 specs**.

---

## Detalhe por suite (specs pendentes de retrofit)

### `adicionar-editar-aba` — 16 specs

Padrão: criam painel via `painelForm.createPanel(data.panelName)` em pré-condição (`allure.step "Pré-condição: criar painel..."`). Nenhum deleta.

| Spec | Cria via | Cleanup esperado |
|---|---|---|
| `criar-painel-happy-path.spec.ts` | `painelForm.getSaveButton().click()` (criação é o test, não pré-condição) | `afterAll deletePanelByNameSafe` |
| `adicionar-nova-aba-criar.spec.ts` | `createPanel` | idem |
| `voltar-step-criar-nova-aba.spec.ts` | `createPanel` | idem |
| `validar-limite-nome-aba-255.spec.ts` | `createPanel` | idem |
| `validar-aba-nova-aba-automatica.spec.ts` | `createPanel` | idem |
| `excluir-aba-multiplas-abas.spec.ts` | `createPanel` | idem |
| `cancelar-renomeacao-aba.spec.ts` | `createPanel` | idem |
| `cancelar-criacao-nova-aba.spec.ts` | `createPanel` | idem |
| `tentar-excluir-aba-unica.spec.ts` | `createPanel` | idem |
| `acessibilidade-teclado-criar-aba.spec.ts` | `createPanel` | idem |
| `renomear-aba-icone-lapis.spec.ts` | `createPanel` | idem |
| `modal-confirmacao-alternar-abas.spec.ts` | `createPanel` | idem |
| `modal-navegador-alteracoes-nao-salvas.spec.ts` | `createPanel` | idem |
| `validacao-campo-nome-obrigatorio.spec.ts` | `getSaveButton().click()` MAS sem nome ⇒ produto barra. **Validar live se cria** — pode ser test 100% negativo. | Conferir, talvez n/a |
| `validacao-limite-descricao-500.spec.ts` | conferir live | conferir |
| `validacao-tipos-caracteres-nome.spec.ts` | `getSaveButton().click()` | conferir |
| `validacao-limite-nome-255.spec.ts` | conferir live | conferir |
| `acessar-tela-criacao-painel.spec.ts` | navegação só (sem create) | n/a |

**Plano**: retrofit os 13 confirmados; para os 4 `validacao-*` + `acessar-tela-*`, ler spec antes pra decidir. Anti-pattern G da skill cobre: "Em dúvida, assumir que precisa".

### `layout-das-abas` — 11 specs

100% chamam `painelForm.createPanel(data.panelName)` no `allure.step` "Pré-condição: criar painel".

```
acessibilidade-teclado-layout · ativar-switch-reorganizar-mover-widget ·
cancelar-edicao-com-alteracoes · estado-vazio-sem-widgets ·
salvar-layout-rodape · switch-desativado-tentar-arrastar ·
toolbar-sticky-rolar · trocar-visualizacao-mobile · trocar-visualizacao-tablet ·
validar-toolbar-fixa · voltar-desktop
```

Cleanup: `afterAll + deletePanelByNameSafe(data.panelName)`.

### `importar-abas` — 11 specs

Criam **1 ou 2 painéis** por test (source + dest). Cleanup deve deletar ambos.

| Spec | Painéis criados |
|---|---|
| `acessar-fluxo-importar-painel` | 1 (dest) |
| `auto-preencher-nome-aba-importada` | 2 (source + dest) |
| `cancelar-importacao` | 1 |
| `editar-aba-importada` | 2 |
| `importar-aba-happy-path` | 2 |
| `importar-painel-sem-abas` | 2 (emptyPanel + dest) |
| `selecionar-categoria-importacao` | 2 |
| `selecionar-painel-origem-listar-abas` | 2 |
| `tentar-importar-sem-painel` | 1 |
| `visualizar-preview-aba` | 2 |
| `voltar-step-importacao` | 1 |

Cleanup: `afterAll` deleta painéis criados (1 ou 2 chamadas a `deletePanelByNameSafe`).

### `adicionar-widgets` — 10 specs

100% chamam `createPanel` + opcionalmente `addWidget`. Delete do painel arrasta widgets vinculados — só precisa `deletePanelByNameSafe`.

```
abrir-drawer-widgets · adicionar-multiplos-widgets-sequencia ·
adicionar-widget-conteudos-andamento · adicionar-widget-meus-certificados ·
adicionar-widget-ranking · adicionar-widget-resumo-atividades ·
filtrar-widgets-categorias · pesquisar-widget-nome ·
validar-componentes-drawer · validar-informacao-literal-widgets ·
validar-widgets-categoria-aprendizagem
```

### `editar-excluir-widgets` — 6 specs

Mesmo padrão: `createPanel` + `addWidget`. Cleanup: `deletePanelByNameSafe`.

```
cancelar-alteracoes-drawer-widget · drawer-configuracoes-editar-widget ·
excluir-widget-icone-x · limite-titulo-drawer-widget ·
salvar-alteracoes-drawer-widget · switches-titulo-icone-desligados
```

### `mobile` — 1 spec

`admin-viewport-mobile-alerta.spec.ts` cria painel pra validar alerta de viewport mobile no admin. Cleanup: `deletePanelByNameSafe`.

Os outros 4 (`aluno-viewport-*`, `aluno-viewport-horizontal`) são read-only — só mudam viewport e validam render.

### `modo-de-uso-paineis-do-usuario` — 1 spec

`nao-reabilitar-menu-painel-inativo.spec.ts` cria painel + associa a menu. Cleanup com **ordem**:

1. `disassociatePanelFromMenu_safe(panelName, useModeId)`
2. `deletePanelByNameSafe(panelName)`

Os outros 2 já cobertos: `selecionar-paineis-usuario-modelo-pagina` (cleanup via `afterEach`); `listar-paineis-campo-espaco` (read-only).

---

## Suites já cobertas (não precisam retrofit)

- **`ativar-inativar-painel`** (4 de 5 com cleanup; 1 fixme legítimo por bug `title_for`)
- **`duplicar-paineis`** (6/6 com `afterAll deletePanelByNameSafe`)
- **`pesquisa-e-filtros/filtro-padrao-paineis-inativos`** (cleanup via toggle reverso)
- **`modo-de-uso-paineis-do-usuario/selecionar-paineis-usuario-modelo-pagina`** (`afterEach disassociate_safe`)

---

## Suites read-only / mock (não precisam cleanup)

`listagem-de-paineis`, `logs`, `feature-flag`, `dashboard-visao-do-aluno`, `beta-launch` (mocka contrato), `trial` (env descartável), `banco-historico`, `worker-migracao-de-paineis`, `worker-reversao`, `ambientes-adicionais`.

**Validação**: confirmar por leitura rápida que não há `createPanel` ou `page.context().route` mockando ⇒ falsa-leitura. Grep já confirmou 0 matches em todas.

---

## Ordem do retrofit (1 commit + push por suite)

1. `adicionar-editar-aba` (16)
2. `layout-das-abas` (11)
3. `importar-abas` (11)
4. `adicionar-widgets` (10)
5. `editar-excluir-widgets` (6)
6. `mobile` + `modo-de-uso-paineis-do-usuario` (2 — batch final)

Total: **6 commits + 6 pushes**.

---

## Pós-retrofit

1. Re-run completa da suíte widgets (`npm run regression --project widgets`).
2. Conferir log do `console.warn` dos `*_safe` — quaisquer warns indicam test que falhou antes da criação OU orphan pré-existente do env. Cleanup manual via UI dos orphans pré-existentes (não-cobertos pelo retrofit) é trabalho separado — listar em `outputs/widgets/orphans-pre-retrofit.md`.
3. Atualizar memória: novo feedback memory `feedback_cleanup_obrigatorio_para_specs` apontando regra G e skill.
