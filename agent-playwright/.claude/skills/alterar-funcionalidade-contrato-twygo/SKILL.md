---
name: alterar-funcionalidade-contrato-twygo
description: Como ativar/desativar funcionalidades em contratos Twygo via Super Admin (`/admin/edit_sys_subscription_settings/<orgId>` → aba Contratos → contrato Vigente → Editar → multiselect Funcionalidades → checkbox + Salvar). Plan/contrato é gate independente do Flipper feature flag — algumas features (ex: Painéis do usuário) requerem ambos ligados pra funcionar. Use sempre que spec falhar com modal "Opção não disponível no seu plano" OU XML pedir cenário com feature gated por plan, e antes de assumir bloqueio por Flipper.
version: 1.0.0
---

# alterar-funcionalidade-contrato-twygo

## Semântica Twygo: plan vs flag

Twygo tem **dois gates independentes** pra controlar feature:

| Gate | Onde | Granularidade | Toggle |
|---|---|---|---|
| **Feature flag (Flipper)** | `/admin/manage/features/<flag>` | Por org (actor) | Sim — UI Flipper, ver [`testar-feature-flag-twygo`](../testar-feature-flag-twygo/SKILL.md) |
| **Plan/contrato (Funcionalidades)** | `/admin/edit_sys_subscription_settings/<orgId>` → Contratos → Editar Vigente | Por contrato (org) | Sim — checkbox + Salvar |

Sintoma de bloqueio por plan (não flag): modal Chakra **"Ops! Essa opção
não está disponível no seu plano"** + select `page_model` sem a option
da feature. Diferente de "aba Painéis simplesmente não aparece" (Flipper).

Algumas features exigem **ambos ligados**:
- `paineis_do_usuario_beta_test` (Flipper) + `user_panels` (Plan)
- (catalogar outros aqui quando descobrir)

## Pré-condição

Usuário com acesso `/admin` (flag elevada). Em `staging-widgets-disabled`,
`claude@teste.com` (`SECONDARY_STORAGE_PATH`) atende.

## Mecanismo UI (validado live 2026-05-15)

Em `https://<host-do-env-disabled>/admin/edit_sys_subscription_settings/<orgId>`:

```
heading "Edição de assinatura"
sidebar com seções: Dados / Cadastro / Administradores / Contratos / ...
- Click <a>Contratos</a> reveal tabela de contratos
- Tabela tem rows: Plano / ID / Data início / Data fim / Situação / Editar / Cancelar / Excluir
- Linha Vigente tem "Situação=Vigente" + button id=`edit-contract-<contractId>` class=`edit-contract-button`
- Click `#edit-contract-<contractId>` abre form inline (mesmo container)
- Form action: POST `/admin/organization_contracts/<contractId>` com `_method=patch`
- Form id: `organization-contract-form`
- Multiselect "Funcionalidades": `<div class="functionality-checkboxes">` com 1 row por feature
- Cada feature: `<input id="<feature_name>" name="<feature_name>" type="checkbox">`
- Features SEM `disabled` attr são togglables (resto é read-only por plano-template)
- Toggle attr `checked` + chamar `ContractOrganization.toogleFunctionality('<feature_name>')` manualmente (handler global)
- Click `button.save-form-button` VISIBLE (há vários no DOM, filtrar por visibilidade)
- Form submete via JS (não `<form>.submit()` programático — perde validação)
- Após save: page reload + checkbox persistido
```

Features togglables descobertas: `user_panels` (Painéis do usuário),
`ai_sync_content` (Agente de atendimento). Resto vem `checked disabled`
do template do plano "Ilimitado" — não toggláveis sem mudar de plano.

## Anti-patterns

### A. ❌ Submeter form via JS `form.submit()`

Não passa por validações JS do Twygo nem chama `ContractOrganization.toogleFunctionality`.
Resultado: page reload mas estado não persiste no banco.

**Correto**: chamar o handler explicit + click no botão `Salvar` visível:

```js
const cb = document.getElementById('user_panels');
if (!cb.checked) cb.click();
window.ContractOrganization.toogleFunctionality('user_panels');
const saveBtn = [...document.querySelectorAll('button.save-form-button')]
  .find(b => b.offsetParent !== null && b.textContent.trim() === 'Salvar');
saveBtn.click();
```

### B. ❌ Múltiplos `button.save-form-button` no DOM

Tem ≥3 botões Salvar (uma por bloco da página). Filtrar por
`offsetParent !== null` (visível) + texto exato `Salvar` (`Salvar como
novo` é outro).

### C. ❌ Não reverter funcionalidade após teste

Contrato é per-org mas tabela de preços é COMPARTILHADA. Outros
specs/projetos contam que `widgetsdisabled` tem `user_panels=false`
nativamente (cenário "disabled"). Sem revert, próxima run lê estado
contaminado.

**Regra**: spec que muda funcionalidade DEVE reverter no `afterAll`
via callback `revert` (igual padrão `ensureFlipperActor`).

### D. ❌ Toggle uma feature `disabled` (read-only)

Features que vêm `disabled` no DOM (`<input ... disabled>`) são fixas
do template do plano — clique no checkbox parece funcionar visualmente
mas POST rejeita. Verificar `cb.disabled === false` antes de toggle;
se `true`, ir mudar o plano-template (`/admin/subscription_plans`) — 
mas isso afeta TODAS as orgs no banco e fere isolamento dos testes.

## Padrão canônico — POM + helper

### POM `SuperAdminPage.setContractFunctionality(orgId, featureName, enabled)`

Estende `src/pages/SuperAdminPage.ts`. Idempotente: no-op se já está
no estado desejado. Retorna `wasEnabled` snapshot pra revert.

### Helper `ensureContractFeature` em `src/utils/contractFeature.ts`

Análogo a `ensureFlipperActor`:

```ts
const revert = await ensureContractFeature(browser, {
  envName: 'staging-widgets-disabled',
  storageStatePath: SECONDARY_STORAGE_PATH,
  orgId: getEnvByName('staging-widgets-disabled').orgId,
  feature: 'user_panels',
  enabled: true,
});
// ... teste ...
await revert();  // restaura estado original
```

Cria contexto fresco por chamada — não polui o `page` do TC.

## Padrão de spec — features gated por plan + flag

Quando uma feature exige ambos:

```ts
test.beforeAll(async ({ browser }) => {
  revertContract = await ensureContractFeature(browser, {
    envName, storageStatePath, orgId, feature: 'user_panels', enabled: true,
  });
  revertFlag = await ensureFlipperActor(browser, {
    envName, storageStatePath, flag: '...', actor: `Organization;${orgId}`, enabled: true,
  });
});

test.afterAll(async () => {
  await revertFlag();    // ordem inversa do setup
  await revertContract();
});
```

Ordem **importa**: contract→flag no setup (plan deve estar ON quando flag
liga pra evitar inconsistência); flag→contract no teardown.

## Quando NÃO usar esta skill

- Plan toggle via console Rails / DB (caminho legítimo de DevOps, mas
  não scriptável no spec)
- Features `disabled` no DOM (gated por template do plano) — não há
  caminho UI seguro pra teste
- Quando o env já tem `user_panels=true` nativo (ex `staging-widgets`
  com plano completo) — não precisa toggle, spec roda direto

## Validação

Recon validado 2026-05-15 no env `staging-widgets-disabled` com contrato
Vigente (Ilimitado) ativo. Toggle `user_panels` ON → salvar → reload →
persistido `checked=true` ✅. Revert ON→OFF idem.
