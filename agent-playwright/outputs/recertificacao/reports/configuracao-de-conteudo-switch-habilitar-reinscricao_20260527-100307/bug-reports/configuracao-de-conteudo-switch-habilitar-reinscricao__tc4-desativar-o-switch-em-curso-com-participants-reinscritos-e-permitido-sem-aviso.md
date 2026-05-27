# [spec-fragil] TC4 — Desativar o switch em curso com participants reinscritos é permitido sem aviso

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-27T13:03:06.667Z · commit 7ade427_

## Identificação
- **Suite**: Configuração de Conteúdo (Switch "Habilitar reinscrição")
- **TC**: TC4 — Desativar o switch em curso com participants reinscritos é permitido sem aviso
- **Spec**: `projects/recertificacao/tests/features/configuracao-de-conteudo-switch-habilitar-reinscricao/tc4-desativar-com-participants.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\ContentEditPage.ts:292:20`
- **Status**: failed (0ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 7ade427

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  Call log:
    - waiting for getByRole('checkbox', { name: /Habilitar reinscrição/i }) to be visible
  
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://basedeconhecimento.stage.twygoead.com/e/3/edit` | **404** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-ad265-ritos-é-permitido-sem-aviso-chromium/test-failed-1.png)
- [error-context](../test-artifacts/projects-recertificacao-te-ad265-ritos-é-permitido-sem-aviso-chromium/error-context.md)
- ![screenshot](../test-artifacts/projects-recertificacao-te-ad265-ritos-é-permitido-sem-aviso-chromium/test-failed-2.png)
- [error-context](../test-artifacts/projects-recertificacao-te-ad265-ritos-é-permitido-sem-aviso-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-ad265-ritos-é-permitido-sem-aviso-chromium/trace.zip)

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