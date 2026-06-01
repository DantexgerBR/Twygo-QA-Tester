# [spec-fragil] TC3 — Ativar e salvar o switch persiste `has_recertification = true`

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-06-01T11:44:11.315Z · commit 62d85ed_

## Identificação
- **Suite**: Configuração de Conteúdo (Switch "Habilitar reinscrição")
- **TC**: TC3 — Ativar e salvar o switch persiste `has_recertification = true`
- **Spec**: `projects/recertificacao/tests/features/configuracao-de-conteudo-switch-habilitar-reinscricao/tc3-ativar-e-salvar-persiste.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\ContentEditPage.ts:70:21`
- **Status**: failed (25226ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 62d85ed

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar a edição de um curso com `has_recertification = false` (tab "Acesso") — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.waitFor: Timeout 20000ms exceeded.
  Call log:
    - waiting for getByRole('tab', { name: /^Acesso$/i }).or(locator('[data-test-id="tab-access"]')).first() to be visible
  
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://recertificacao-testeqa.stage.twygoead.com/contents/807446/edit` | **404** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-ccb33-e-has-recertification-true--chromium/test-finished-1.png)
- ![screenshot](../test-artifacts/projects-recertificacao-te-ccb33-e-has-recertification-true--chromium/test-failed-2.png)
- [video](../test-artifacts/projects-recertificacao-te-ccb33-e-has-recertification-true--chromium/video-1.webm)
- [video](../test-artifacts/projects-recertificacao-te-ccb33-e-has-recertification-true--chromium/video.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-ccb33-e-has-recertification-true--chromium/error-context.md)
- ![screenshot](../test-artifacts/projects-recertificacao-te-ccb33-e-has-recertification-true--chromium/test-failed-3.png)
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