# [spec-fragil/data-stale] Selecionar 'Painéis do usuário' como modelo de página no modo de uso

> _Categoria refinada manualmente: **spec-fragil/data-stale** (confiança alta) — validada ao vivo via chrome-devtools-mcp em 2026-05-14. Causa raiz: dado hardcoded `panelName: 'Painel Aluno'` em `selecionar-paineis-usuario-modelo-pagina.data.ts:3` referencia um painel que **NÃO EXISTE** no env `staging-widgets` (orgId 36988). Dropdown só lista `Painel 1..10`. UI funciona corretamente — o filtro client-side simplesmente não acha "Painel Aluno", então `[id^="react-select-"][id$="-option-0"]` nunca renderiza._
> _Gerado em 2026-05-14T15:09:41.190Z · commit 13a7918 · revisado 2026-05-14_

## Identificação
- **Suite**: Modo de uso - Painéis do usuário
- **TC**: Selecionar 'Painéis do usuário' como modelo de página no modo de uso
- **Spec**: `projects/widgets/tests/features/modo-de-uso-paineis-do-usuario/selecionar-paineis-usuario-modelo-pagina.spec.ts`
- **Erro em**: `C:\Claude\Widgets\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\modo-de-uso-paineis-do-usuario\selecionar-paineis-usuario-modelo-pagina.spec.ts:67:25`
- **Status**: failed (49883ms)

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
  2. 2. Preencher Nome do menu — ✅
  3. 3. Selecionar 'Painéis do usuário' no Modelo de página — ✅
  4. 4. Escolher 'Painel Aluno' no campo Espaço e salvar — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: Após selecionar "Painéis do usuário" e digitar "Painel Aluno" no campo Espaço, o react-select deve filtrar e exibir o option "Painel Aluno" (primeiro da lista filtrada). Click no `[id^="react-select-"][id$="-option-0"]` o seleciona e o form pode ser salvo, redirecionando para `/use_modes/{useModeId}/edit?tab=items`.
- **Observado (UI)**: Comportamento correto — o dropdown abre, contém 10 opções reais (`Painel 1`, `Painel 2`, ..., `Painel 10`), filtro client-side responde a input. **Nenhum painel chamado "Painel Aluno"** existe no env staging-widgets atual.
- **Observado (spec)**: Após digitar `data.panelName` (= `'Painel Aluno'`), o react-select filtra e retorna 0 matches. `[id^="react-select-"][id$="-option-0"]` nunca renderiza. `locator.click()` timeouta em 30s.
  ```
  TimeoutError: locator.click: Timeout 30000ms exceeded.
  Call log:
    - waiting for locator('[id^="react-select-"][id$="-option-0"]').first()
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![step-01-1-Setup-navegar-ao-form-de-novo-item-de-menu](../test-artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/attachments/step-01-1-Setup-navegar-ao-form-de-novo-item-de-menu-11c5d3438424ff1a908ad1df5d40eecb41d9ce81.png)
- ![step-02-2-Preencher-Nome-do-menu](../test-artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/attachments/step-02-2-Preencher-Nome-do-menu-13ad4ea31bfd30ef9987c1e09239851e5b57b621.png)
- ![step-03-3-Selecionar-Pain-is-do-usu-rio-no-Modelo-de-p-gina](../test-artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/attachments/step-03-3-Selecionar-Pain-is-do-usu-rio-no-Modelo-de-p-gina-c4bc557d5e8efc485cf40f81b08b02cb6620e2e0.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/video.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/trace.zip)

### IDs envolvidos
- orgId: 36988
- useModeId: 70077

### Validação chrome-mcp (2026-05-14)

1. Login em `widgets.stage.twygoead.com` com `claude@teste.com`
2. Navegar `/o/36988/use_modes/70077/use_mode_itens/new`
3. Preencher Nome → selecionar "Painéis do usuário" → campo Espaço aparece
4. Clicar combobox de Espaço → dropdown abre:
   - Live region anuncia: `"10 results available."`
   - Listbox renderiza 10 options: `Painel 1`, `Painel 2`, ..., `Painel 10`
   - **Não há nenhum painel chamado "Painel Aluno"**
5. Filtro por substring "Painel Aluno" retorna 0 matches (esperado, dado o conteúdo real)

Conclusão: dado de teste em `selecionar-paineis-usuario-modelo-pagina.data.ts:3` está desatualizado em relação ao seed do env. Bug é **data-stale**, não bug de UI nem seletor frágil.

### Fix sugerido

3 opções, em ordem de robustez:

1. **Trocar pra um painel existente** (mais simples): em `selecionar-paineis-usuario-modelo-pagina.data.ts`, trocar `panelName: 'Painel Aluno'` por `panelName: 'Painel 1'`. Re-executar spec.
2. **Resolver dinamicamente** (mais robusto): em vez de hardcoded, ler primeiro option do dropdown. Spec testa o fluxo "selecionar primeiro painel disponível", não um painel específico — invariante mais resistente a mudança de seed.
3. **Adicionar seed dedicado** (mais explícito): criar painel "Painel Aluno" via API/factory antes do teste, deletar no afterEach. Custo: precisa endpoint de criação programática ou storage state pré-populado.

## Escopo
- **Reproduz em outro usuário?** Sim — o nome `Painel Aluno` é hardcoded em `*.data.ts`, qualquer usuário no env staging-widgets vai falhar igual
- **Reproduz em outro env?** Provável que sim em qualquer env Twygo que não tenha um painel chamado exatamente "Painel Aluno" (string match)
- **Regressão?** Provável bug-de-dado introduzido no spec. Painel "Painel Aluno" pode ter sido deletado/renomeado entre a criação do spec e hoje
- **Workaround**: trocar nome do painel hardcoded por um que existe (ver Fix sugerido #1)

## Impacto
- **Severity sugerida**: **baixa** — spec frágil, não bug de produto. Fix trivial (1 linha)
- **Impacto qualitativo**: spec não cobre o cenário "criar item de menu com modelo Painéis do usuário" até o fix. Outros TCs do projeto não dependem deste

## Destinatário sugerido
**QA / autor do spec** — fix em 1 linha em `*.data.ts`. Considerar refactor (Fix #2) pra evitar repetição do problema em outros specs que dependem de seed específico.

---

> _Gerado por `gerar-bug-report-de-tc-red` v1.0.0. Campos `[REVISAR]` exigem validação humana antes de abrir task._