# [spec-fragil] TC3 — Ativar e salvar o switch persiste `has_recertification = true`

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-26T18:52:32.581Z · commit 642f0a5_

## Identificação
- **Suite**: Configuração de Conteúdo (Switch "Habilitar reinscrição")
- **TC**: TC3 — Ativar e salvar o switch persiste `has_recertification = true`
- **Spec**: `projects/recertificacao/tests/features/configuracao-de-conteudo-switch-habilitar-reinscricao/tc3-ativar-e-salvar-persiste.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\SeedAdminPage.ts:286:21`
- **Status**: failed (0ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 642f0a5

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  Call log:
    - waiting for getByRole('textbox', { name: /^Nome \*/ }) to be visible
  
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://basedeconhecimento.stage.twygoead.com/e/2/edit` | **404** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-ccb33-e-has-recertification-true--chromium/test-failed-1.png)
- [error-context](../test-artifacts/projects-recertificacao-te-ccb33-e-has-recertification-true--chromium/error-context.md)
- [error-context](../test-artifacts/projects-recertificacao-te-ccb33-e-has-recertification-true--chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-ccb33-e-has-recertification-true--chromium/trace.zip)

### IDs envolvidos
- orgId: 37048

## Escopo
- **Reproduz em outro usuário?** `[REVISAR isolamento]`
- **Reproduz em outro env?** `[REVISAR isolamento]`
- **Regressão?** desconhecida `[REVISAR regressão]`
- **Workaround**: nenhum identificado `[REVISAR workaround]`

## Impacto
- **Severity sugerida**: **baixa** `[REVISAR severity]`
- **Impacto qualitativo**: desconhecido `[REVISAR impacto]`

---

> _Gerado por `gerar-bug-report-de-tc-red` v1.0.0. Campos `[REVISAR]` exigem validação humana antes de abrir task._