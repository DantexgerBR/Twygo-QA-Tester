# [spec-fragil] TC4 — Botão "Reinscrever" fica visível mas DESABILITADO quando event.has_recertification = false

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-28T19:46:18.281Z · commit 569a4ad_

## Identificação
- **Suite**: Reinscrição Individual pelo Admin
- **TC**: TC4 — Botão "Reinscrever" fica visível mas DESABILITADO quando event.has_recertification = false
- **Spec**: `projects/recertificacao/tests/features/reinscricao-individual-pelo-admin/tc4-botao-reinscrever-disabled-has-recertification-false.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\src\pages\ProfileSwitcher.ts:52:40`
- **Status**: failed (31927ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 569a4ad

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.innerText: Timeout 30000ms exceeded.
  Call log:
    - waiting for locator('button.menu-target')
  
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-6e331-t-has-recertification-false-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-6e331-t-has-recertification-false-chromium/video-1.webm)
- [video](../test-artifacts/projects-recertificacao-te-6e331-t-has-recertification-false-chromium/video.webm)
- ![screenshot](../test-artifacts/projects-recertificacao-te-6e331-t-has-recertification-false-chromium/test-failed-2.png)
- [error-context](../test-artifacts/projects-recertificacao-te-6e331-t-has-recertification-false-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-6e331-t-has-recertification-false-chromium/trace.zip)

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