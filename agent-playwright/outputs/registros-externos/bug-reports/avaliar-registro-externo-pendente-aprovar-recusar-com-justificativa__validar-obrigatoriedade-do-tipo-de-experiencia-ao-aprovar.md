# [inconclusivo] Validar obrigatoriedade do Tipo de experiência ao Aprovar

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-06-25T20:15:00.266Z · commit e6637f3_

## Identificação
- **Suite**: Avaliar registro externo pendente (Aprovar/Recusar com justificativa)
- **TC**: Validar obrigatoriedade do Tipo de experiência ao Aprovar
- **Spec**: `projects/registros-externos/tests/features/avaliar-registro-externo-pendente/tc3-obrigatoriedade-tipo-ao-aprovar.spec.ts`
- **Erro em**: `D:\Estudo\Programação\cursor\twygo-work\twygo-agents-qa\agent-playwright\projects\registros-externos\tests\features\avaliar-registro-externo-pendente\tc3-obrigatoriedade-tipo-ao-aprovar.spec.ts:42:36`
- **Status**: failed (28918ms)

## Ambiente
- **Env**: staging-registros-externos (`https://registrosf2.stage.twygoead.com/`)
- **OrgId**: 37079
- **Usuário**: dante.tavares@twygo.com
- **Browser**: chromium
- **Build/commit**: e6637f3

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. Pré: criar Externo Pendente e abrir "Avaliar" — ✅
  2. 2. Aprovar com Tipo vazio → "Campo obrigatório", não aprova — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: locator('.chakra-form-control').filter({ has: locator('label').filter({ hasText: /^Tipo de experiência/ }) }).first().getByText(/Campo obrigatório/i).first()
  Expected: visible
  Timeout: 8000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |
| GET | `https://registrosf2.stage.twygoead.com/api/v1/o/37079/beta_test/get_active_beta_test_notification?feature_name=registros_avaliacao&with_notification_history=true` | **400** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-registros-externo-1601e-o-de-experiência-ao-Aprovar-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-registros-externo-1601e-o-de-experiência-ao-Aprovar-chromium/video.webm)
- [video](../test-artifacts/projects-registros-externo-1601e-o-de-experiência-ao-Aprovar-chromium/video-1.webm)
- [error-context](../test-artifacts/projects-registros-externo-1601e-o-de-experiência-ao-Aprovar-chromium/error-context.md)
- ![screenshot](../test-artifacts/projects-registros-externo-1601e-o-de-experiência-ao-Aprovar-chromium/test-failed-2.png)
- [error-context](../test-artifacts/projects-registros-externo-1601e-o-de-experiência-ao-Aprovar-chromium/error-context.md)
- [trace](../test-artifacts/projects-registros-externo-1601e-o-de-experiência-ao-Aprovar-chromium/trace.zip)

### IDs envolvidos
- orgId: 37079

## Escopo
- **Reproduz em outro usuário?** `[REVISAR isolamento]`
- **Reproduz em outro env?** `[REVISAR isolamento]`
- **Regressão?** desconhecida `[REVISAR regressão]`
- **Workaround**: nenhum identificado `[REVISAR workaround]`

## Impacto
- **Severity sugerida**: **media** `[REVISAR severity]`
- **Impacto qualitativo**: desconhecido `[REVISAR impacto]`

---

> _Gerado por `gerar-bug-report-de-tc-red` v1.0.0. Campos `[REVISAR]` exigem validação humana antes de abrir task._