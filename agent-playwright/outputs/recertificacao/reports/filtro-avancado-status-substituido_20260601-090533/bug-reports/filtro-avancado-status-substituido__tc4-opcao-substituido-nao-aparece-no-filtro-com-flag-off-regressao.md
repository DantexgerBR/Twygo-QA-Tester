# [modal-nao-tratado] TC4 — Opção "Substituído" NÃO aparece no filtro com flag OFF (regressão)

> _Categoria confiança: **alta** — Click interceptado — overlay/modal por cima do alvo_
> _Gerado em 2026-06-01T12:05:31.251Z · commit 62d85ed_

## Identificação
- **Suite**: Filtro Avançado Status Substituído
- **TC**: TC4 — Opção "Substituído" NÃO aparece no filtro com flag OFF (regressão)
- **Spec**: `projects/recertificacao/tests/features/filtro-avancado-status-substituido/tc4-opcao-substituido-nao-aparece-flag-off-regressao.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\LearningStudentsPage.ts:81:34`
- **Status**: failed (52144ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 62d85ed

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Desativar a feature flag `:recertificacao` → Flag OFF — ✅
  2. 2. Acessar a lista de aprendizagem e abrir o filtro avançado de Status do certificado → Drawer de filtro é exibido — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.click: Timeout 30000ms exceeded.
  Call log:
    - waiting for locator('#open-filter')
      - locator resolved to <button type="button" id="open-filter" class="chakra-button css-it72td" data-test-id="filter-control-open-button">…</button>
    - attempting click action
      2 × waiting for element to be visible, enabled and stable
        - element is visible, enabled and stable
        - scrolling into view if needed
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-2dce4-tro-com-flag-OFF-regressão--chromium/test-finished-1.png)
- ![screenshot](../test-artifacts/projects-recertificacao-te-2dce4-tro-com-flag-OFF-regressão--chromium/test-failed-2.png)
- [video](../test-artifacts/projects-recertificacao-te-2dce4-tro-com-flag-OFF-regressão--chromium/video-1.webm)
- [video](../test-artifacts/projects-recertificacao-te-2dce4-tro-com-flag-OFF-regressão--chromium/video.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-2dce4-tro-com-flag-OFF-regressão--chromium/error-context.md)
- [error-context](../test-artifacts/projects-recertificacao-te-2dce4-tro-com-flag-OFF-regressão--chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-2dce4-tro-com-flag-OFF-regressão--chromium/trace.zip)

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