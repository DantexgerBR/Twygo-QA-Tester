# [spec-fragil] TC1 — Opção "Substituído" aparece no filtro avançado de Status do certificado com flag ON

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-26T03:42:02.048Z · commit 399deb9_

## Identificação
- **Suite**: Filtro Avançado Status Substituído
- **TC**: TC1 — Opção "Substituído" aparece no filtro avançado de Status do certificado com flag ON
- **Spec**: `projects/recertificacao/tests/features/filtro-avancado-status-substituido/tc1-opcao-substituido-aparece-no-filtro-flag-on.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\LearningStudentsPage.ts:81:34`
- **Status**: failed (33917ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 399deb9

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar a lista de aprendizagem em "/learning_students" → Lista é exibida com colunas Nome, Status do certificado, etc. — ✅
  2. 2. Clicar no ícone de filtro da coluna "Status do certificado" → Drawer de filtro avançado é exibido com lista de opções — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.click: Timeout 30000ms exceeded.
  Call log:
    - waiting for locator('#open-filter')
  
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://basedeconhecimento.stage.twygoead.com/o/37007/events/1/learning_students` | **404** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-d67a4--do-certificado-com-flag-ON-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-d67a4--do-certificado-com-flag-ON-chromium/video-1.webm)
- [video](../test-artifacts/projects-recertificacao-te-d67a4--do-certificado-com-flag-ON-chromium/video.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-d67a4--do-certificado-com-flag-ON-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-d67a4--do-certificado-com-flag-ON-chromium/trace.zip)

### IDs envolvidos
- orgId: 37007

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