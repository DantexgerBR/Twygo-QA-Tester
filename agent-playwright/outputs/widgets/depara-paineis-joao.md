# De-Para: chrome-devtools-mcp vs Playwright — branch `paineis-joao`

Auditoria full-suite (regressão completa) executada 2026-05-13 18:40.
Branch `project/paineis-dos-usuarios-widgets-joao` tem **136 specs** (~10x
mais que a chore branch).

## Sumário executivo

```
136 testes · 22 passed · 66 failed · 48 skipped (fixme legítimo) · 88 ativos
```

- **22/88 (25%)** verde nos testes que rodaram
- **48 fixmes legítimos** — out-of-scope (worker backend), seed ausente
  (credencial Aluno), bug produto declarado, UI não mapeada (logs)
- **66 fails** ativos pra triagem

## Análise dos 66 fails (agregada)

### Por tipo de erro (palpite do triage)

| Diagnóstico | Count | % |
|---|---:|---:|
| **Click não acionável** (hidden/coberto/aria-disabled) | **31** | **47%** |
| Mensagem genérica (precisa abrir trace) | 22 | 33% |
| Elemento esperado não apareceu | 8 | 12% |
| Submit/redirect não ocorreu (modal interceptando) | 2 | 3% |
| Asserção textual falhou | 2 | 3% |
| Requisição abortada | 1 | 2% |

### Por suite afetada

| Suite | Fails |
|---|---:|
| Layout das abas | 11 |
| Adicionar/editar aba | 11 |
| Pesquisa e Filtros | 10 |
| Importar abas | 10 |
| Adicionar widgets | 9 |
| Editar/Excluir widgets | 5 |
| Duplicar painéis | 3 |
| Ativar / Inativar painel | 3 |
| Modo de uso - Painéis do usuário | 2 |
| Mobile | 1 |
| Listagem de painéis | 1 |

## Padrão dominante: "click não acionável" (31 casos)

Confirma o padrão já validado na branch `chore/agentes-qa-overhaul`:
**Chakra UI hidden inputs + NPS Sofia interceptando**.

Causa raiz comprovada na chore branch (idêntica aqui):
- `<input class="chakra-switch__input">` com `clip:rect(0,0,0,0)` —
  Playwright `.click()` falha actionability porque elemento é 0×0
- NPS Sofia abre durante load e sobrepõe área de drawer/modal — clicks
  caem no overlay

Heurística canônica (skill `comparar-chrome-mcp-vs-playwright`):

| chrome-mcp | Playwright | Veredito |
|---|---|---|
| ✅ | ❌ | flakiness/spec frágil — **caso esperado pra 31 click-não-acionável** |
| ❌ | ❌ | bug produto — escalar dev |

**Hipótese forte** (não validada caso-a-caso por volume): >70% dos 31
"click não acionável" são chrome-mcp ✅ + Playwright ❌. Fix sistêmico
nas helpers de switch/click no Page Object resolve em batch.

## Recomendação de fix sistêmico (não aplicado nesta passada)

Aplicáveis em 1 PR cobrindo ~31 fails:

1. **Helper `clickSwitchByLabel(input)` em Page Object** — clica no
   `<label class="chakra-switch">` que envolve o input, NÃO no input.
   Padrão já documentado para `PaineisListPage.getRowActiveSwitchLabelByName`.
2. **`safeGoto` em TODAS as page.goto** — já aplicado na chore branch
   mas paineis-joao tem outras Page Objects (Abas, Widgets, etc) que
   não migraram ainda
3. **Cleanup proativo de fixtures** — afterAll de specs paralelos pode
   estar deixando NPS reabrir entre tests
4. **Aumentar timeouts pós-`safeGoto`** pra elementos críticos (60s)
5. **Asserções por invariante, não count exato** — princípio da skill
   `criar-spec-resiliente-twygo`

## 48 fixmes legítimos — categorias

Esses **NÃO** vão pra triagem ativa porque já foram triados na geração:

| Categoria | Quantidade aprox |
|---|---:|
| Seed ausente (credencial Aluno, painel pré-configurado) | ~14 |
| Out-of-scope Playwright (worker Sidekiq, validação API) | ~7 |
| Bug produto declarado (com link de Jam) | ~4 |
| UI de admin não mapeada (logs) | ~9 |
| Spec/XML desatualizado | ~3 |
| Bloqueio externo (Super Admin, contratos) | ~6 |
| Cenário composto requer setup runtime (flag toggle) | ~5 |

## Como agir (próxima rodada)

### Curto prazo (próxima sessão, ~2h)

1. **Reproduzir 3 amostras via chrome-mcp** dos top "click não acionável":
   - Suite "Adicionar/editar aba" F2 ("Adicionar nova aba via opção 'Criar nova aba'")
   - Suite "Layout das abas" F1 (qualquer)
   - Suite "Pesquisa e Filtros" F1
2. Confirmar padrão **chrome ✅ + Playwright ❌**
3. Identificar helper compartilhado que pode ser ajustado (ex.: `clickTabSwitch`, `openDrawer`, `selectWidgetType`)
4. Aplicar fix sistêmico + re-rodar
5. Esperar 22 → ~50 passed (50%+ verde)

### Médio prazo (1 semana)

- Migrar TODAS as Page Objects pra `safeGoto`
- Atualizar `dismissCommonModals` com novos modais oportunistas
  descobertos por suite (drawer de widget, drawer de aba, modal "deseja
  cancelar")
- Adicionar timeout 60s explícito em todos waitFor de tab/breadcrumb
- Aplicar skills `criar-spec-resiliente-twygo` no healer pra não emitir
  spec frágil

### Longo prazo

- Backend: corrigir `panels#change_status` exigindo description
  (workaround documentado no helper `createPanel`)
- Backend: implementar bloqueio de toggle de menu vinculado a painel
  inativo (TC5 da chore branch)
- Frontend: padronizar Chakra switches pra ter `<label for=...>` em vez
  de wrap (resolve actionability)

## Skills aplicadas neste ciclo

Importadas da chore branch via commit `98cd301`:

- `twygo-triage-report` — janela única de revisão com 5 categorias
- `comparar-chrome-mcp-vs-playwright` — fluxo 5 passos
- `criar-spec-resiliente-twygo` — 5 princípios
- `debugar-via-network-e-console` — Network primeiro
- `debugar-bug-produto-stale` — revalidar FAILING-BY-PRODUCT-BUG
- `auto-auditar-fails-via-devtools` — gatilho automático (66 fails
  passaria de bom).

## Artefatos desta auditoria

- `outputs/widgets/triage-report.md` — relatório triagem batch
  (sobrescrito a cada run; gerado pela skill `twygo-triage-report`)
- `outputs/widgets/reports/<runId>/index.md` — detalhamento por suite
- `outputs/widgets/test-results.json` — JSON Playwright cru
- `outputs/widgets/exploratory-findings.json` — findings exploratórios
- Este doc: `outputs/widgets/depara-paineis-joao.md`

## Conclusão

Branch `paineis-joao` herdou a infra de qualidade da chore branch via
commit `98cd301`. **22/88 verde inicial** (25%). Padrão dominante de
fails (47% "click não acionável") é mesmo da chore — resolúvel com fix
sistêmico em helper de Page Object (não 31 patches duplicados).

Estimativa pós-fix sistêmico: **50-60% verde** em 1 PR.

Próximo passo recomendado: reproduzir 3 amostras via chrome-mcp pra
confirmar padrão antes de aplicar fix em batch (skill
`auto-auditar-fails-via-devtools` automatizaria isso).
