# Suíte Trial — registros-externos

Roda contra a **Trial dedicada do projeto** (`trial-registros-externos`,
org **37078**, `registrostrial.stage.twygoead.com`), credenciais em `.env`
(`TWYGO_TRIAL_REGISTROS_EXTERNOS_*`). Config em `data/trial-env.json`.

Login é explícito no `beforeEach` (globalSetup cobre só o env principal do
projeto — exceção autorizada ao Anti-pattern A; ver skill
`testar-exclusao-dados-trial-twygo`).

| TC | Arquivo | Estado | Observação |
|----|---------|--------|------------|
| TC1 | `tc1-feature-registros-trial-via-url.spec.ts` | ✅ runnable | Valida feature Registros + cria registro Externo pela UI. Verificado live 2026-06-25. |
| TC2 | `tc2-feature-registros-trial-via-api.spec.ts` | ⊘ fixme | API de onboarding sem token no `.env`; executor = agent-api (não existe). §7.6 F. |
| TC3 | `tc3-exclusao-dados-predefinidos-sophiatech.spec.ts` | ⚠️ runnable **DESTRUTIVO** | Exclui seed SophiaTech via widget Sophia. Zera parte da Trial. |
| TC4 | `tc4-exclusao-total-trial.spec.ts` | ⚠️ runnable **DESTRUTIVO** + DB manual | Cria registro+provedor → exclusão "Todas" → zera Trial. Passo 3 (banco) = agent-db. |

## ⚠️ Destrutividade (TC3 / TC4)

A exclusão **zera a Trial** e re-provisionar exige passos manuais
(`provisionar-trial-projeto-twygo`: DB `organization_icps.icp5` + unlock de
email). Por isso TC3/TC4 **não** entram em regressivo automático sem intenção
explícita. Rodar isolado e com decisão consciente:

```bash
PROJECT=registros-externos npx playwright test projects/registros-externos/tests/features/trial/tc3-exclusao-dados-predefinidos-sophiatech.spec.ts
```

Ordem natural quando executados em sequência: TC1 → TC3 → TC4 (TC4 "Todas"
deixa a Trial em tabula rasa — sinal esperado de Trial consumida).

## Gotchas (recon 2026-06-25)

- Widget Sophia "Excluir informações" só aparece em `/dashboard_students` (não em `/records` nem `/play`).
- Botão Salvar do form de registro é interceptado pelo widget Sophia flutuante → `dispatchEvent('click')` (no POM `NovoRegistroExternoPage`).
- Schema real = `events/*` (não `learning_*`) — afeta o SQL manual do TC4.
