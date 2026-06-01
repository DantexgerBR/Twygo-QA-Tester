---
name: tratar-modal-beta-end-twygo
description: Modal Chakra "BETA teste da funcionalidade Painéis do usuário chegou ao fim" aparece assincronamente em qualquer página admin do staging — intercepta clicks com aria-hidden no background. Documenta dismissal correto via CSS ID estável, anti-pattern fallback hasText que captura drawers Chakra, e estratégia de pré-emptive dismiss em SeedAdminPage/ContentEditPage.
when_to_use: |
  - Spec falha com "intercepts pointer events" + screenshot mostra modal "BETA teste"
  - Spec falha em `getByRole('textbox', { name: 'Nome *' })` timeout 15s+ em SeedAdminPage.createCurso
  - Spec falha em click de tab/botão com chakra-portal interceptando
  - Antes de adicionar/editar `dismissCommonModals` em qualquer Page Object Twygo
triggers:
  - "beta-end-modal"
  - "beta-end-modal-race"
  - "BETA teste"
  - "Painéis do usuário"
  - "chakra-portal intercepts pointer events"
  - "modal BETA"
  - "modelo de página duplicado"
---

# Tratar modal BETA-end Twygo

## O modal

Pop-up de pesquisa de encerramento do beta de "Painéis do usuário".
Aparece **assincronamente após navegar** em qualquer página admin do
staging (`/o/{orgId}/contents/new`, `/contents/{id}/edit`,
`/o/{orgId}/dashboard`, etc), montado via Chakra portal DEPOIS do
`domcontentloaded`. Quando aberto, aplica `aria-hidden="true"` no
background — `getByRole('textbox')` e similares ARIA-aware deixam de
resolver e specs falham com `intercepts pointer events`.

### Marcadores DOM canônicos (validados live 2026-06-01)

- ID Chakra do body: `chakra-modal--body-beta-end-modal`
- Portal wrapper: `<div class="chakra-portal">` que envolve o
  `[id*="beta-end-modal"]`
- Botão dismiss: `<button aria-label="Close">` dentro do header do modal
- Conteúdo textual: começa com "O BETA teste da funcionalidade
  painéis do usuário chegou ao fim!"

### Por que NÃO some sozinho

Modal é per-organization mas re-aparece em sessões novas mesmo após
dismissal. Resposta manual da pesquisa elimina por TEMPO LIMITADO —
ressurge após X dias. Tratamento via `dismissCommonModals` é
**obrigatório** em qualquer fluxo admin.

## Dismissal canônico

### Seletor primário (preferir)

```ts
page.locator(
  '.chakra-portal:has(#chakra-modal--body-beta-end-modal) button[aria-label="Close"]',
).first()
```

Já implementado em [`src/utils/modals.ts`](../../src/utils/modals.ts)
candidato 5 (linha 264).

### Fallback robusto (caso ID mude)

```ts
page
  .locator('[id*="beta-end-modal"]')
  .locator('xpath=ancestor::*[contains(@class, "chakra-portal") or @role="dialog"][1]')
  .locator('button[aria-label="Close"]')
  .first()
```

Linha 273-277 de modals.ts. **Exige presença explícita** de
`[id*="beta-end-modal"]` — não captura drawers Chakra (Filtro
Avançado, Inscrição em Massa).

### Pré-emptive em createCurso / openEdit

Quando navegação leva a página admin, **chamar `dismissCommonModals`
com `initialWaitMs >= 1500`** antes de interagir:

```ts
await safeGoto(page, `/o/${orgId}/contents/new?kind=0`);
await dismissCommonModals(page, { initialWaitMs: 3000 });
// Modal pode reaparecer entre fill do Nome e click no combobox —
// dismissal de segurança no meio do fluxo:
await dismissCommonModals(page, { initialWaitMs: 1500 });
await page.locator('.chakra-portal:has(#chakra-modal--body-beta-end-modal)')
  .waitFor({ state: 'hidden', timeout: 5000 }).catch(() => null);
```

Padrão consolidado em `SeedAdminPage.createCurso` (linhas 286-330,
3 chamadas a `dismissCommonModals` em pontos críticos).

## Anti-patterns

### A. Fallback `hasText: /BETA teste/i` (REJEITADO)

❌ ```ts
page
  .getByRole('dialog')
  .filter({ hasText: /BETA teste da funcionalidade/i })
  .getByRole('button', { name: /close|fechar/i })
```

Captura drawers Chakra também (Filtro Avançado, Inscrição em Massa,
"Modelo de página duplicado") — drawers também são `role="dialog"` e
podem conter texto que contém "teste" em descrição. Causou regressão
em Suite Filtro Avançado TC4 (commit `88f26da` → estado HEAD).

✅ Usar seletor por ID estável (acima).

### B. Inferir causa por screenshot sem ler trace.zip

❌ Screenshot mostra modal → "modal intercepta" → adiciono `dismiss`
   no método X.
✅ Abrir `trace.zip` com `npx playwright show-trace` — Network mostra
   request pendente (modal de fato) ou 403 (auth/perfil — vide
   `evitar-reinventar-resolvidos-twygo` §F).

### C. Editar Page Object sem grep consumidores

❌ TC red → modifico `ContentEditPage.goToAcessoTab` adicionando
   dismiss.
✅ `grep -rn "goToAcessoTab"`. Se `SeedAdminPage.setHasRecertification`
   já consome com sucesso → método OK, problema é state-dependent no
   contexto de uso.

### D. `force: true` em vez de dismissal

❌ `await tab.click({ force: true })` ignorando aria-hidden.
✅ Dismissar modal antes — `force: true` mascarará erros futuros
   (form submit silencioso, etc).

## Quando NÃO usar esta skill

- Modal é OUTRO (NPS Sofia, "Continuar mesmo assim", "Modelo de página
  duplicado") → ver `fechar-modais-twygo` que cataloga todos
- Erro é "Você não tem permissão para acessar esta página" → não é
  modal, é falta de `ensureAdminProfile` (skill
  `evitar-reinventar-resolvidos-twygo` §F)
- TC roda em rota não-admin (`/users/login`, `/play`) — modal não
  aparece lá

## Cross-links

- [[fechar-modais-twygo]] — catálogo geral de modais Twygo (esta
  skill é o detalhe específico do beta-end)
- [[evitar-reinventar-resolvidos-twygo]] — verificar consumidor
  canônico ANTES de modificar `dismissCommonModals`
- [[debugar-via-network-e-console]] — ritual antes de inferir "modal
  X intercepta"
- [[regressao-pre-commit-twygo]] — rodar regressão após mexer em
  `src/utils/modals.ts` (incidente 2026-06-01 documenta regressão
  silenciosa em 6 suítes por heal cosmético neste arquivo)

## Histórico

- **2026-05-13**: modal "Modelo de página duplicado" descoberto live
  via chrome-devtools-mcp — adicionado em `dismissCommonModals`.
- **2026-06-01**: modal "beta-end" descoberto via screenshot de
  falha TC1/3/4 Suite Configuração de Conteúdo. Adicionado candidato
  5 em modals.ts. Fallback `hasText` inicial capturou drawers e
  causou regressão Filtro TC4 — refatorado pro xpath ancestor com ID
  explícito.
- **2026-06-01 (segunda iteração)**: incidente documentado em
  `evitar-reinventar-resolvidos-twygo` — agente tentou consertar
  `ContentEditPage.openEditReactAccessById` 6× sem perceber que era
  state-dependent. Esta skill nasceu como contramedida.
