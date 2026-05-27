# [spec-fragil] TC1 — Switch "Habilitar reinscrição" aparece com flag ON na edição de curso

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-27T13:03:06.667Z · commit 7ade427_

## Identificação
- **Suite**: Configuração de Conteúdo (Switch "Habilitar reinscrição")
- **TC**: TC1 — Switch "Habilitar reinscrição" aparece com flag ON na edição de curso
- **Spec**: `projects/recertificacao/tests/features/configuracao-de-conteudo-switch-habilitar-reinscricao/tc1-switch-aparece-com-flag-on.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\ContentEditPage.ts:193:26`
- **Status**: failed (32242ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 7ade427

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar a URL "/o/{orgId}/dashboard" — ✅
  2. 2. Navegar até a listagem de cursos da organização — ✅
  3. 3. Clicar em "Gerenciar" no menu de ações do curso → página de edição é exibida — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
  Call log:
    - waiting for locator('tr, [role="row"]').filter({ hasText: 'Curso Recertificação TC1 w0-1779886753359' }).first().locator('img[alt="Options" i], [role="button"][aria-label*="Options" i], [role="button"][aria-label*="Opções" i]').first() to be visible
  
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium/test-finished-1.png)
- ![screenshot](../test-artifacts/projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium/test-failed-2.png)
- [video](../test-artifacts/projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium/video-1.webm)
- [video](../test-artifacts/projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium/video.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium/error-context.md)
- ![screenshot](../test-artifacts/projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium/test-failed-3.png)
- [error-context](../test-artifacts/projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium/trace.zip)

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