# [spec-fragil] TC3 — Badge "Substituído" é exibido na coluna de Status para participants com certificate_status = 4

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-26T03:42:02.048Z · commit 399deb9_

## Identificação
- **Suite**: Filtro Avançado Status Substituído
- **TC**: TC3 — Badge "Substituído" é exibido na coluna de Status para participants com certificate_status = 4
- **Spec**: `projects/recertificacao/tests/features/filtro-avancado-status-substituido/tc3-badge-substituido-coluna-status.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\LearningStudentsPage.ts:81:34`
- **Status**: failed (34546ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 399deb9

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar a lista de aprendizagem sem filtros aplicados → Lista é exibida — ✅
  2. 2. Localizar a linha de um aluno com certificado REPLACED (certificate_status = 4) → Coluna "Status do certificado" exibe badge com label "Substituído" — ❌ **falhou aqui**
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
- ![screenshot](../test-artifacts/projects-recertificacao-te-c99a9-ts-com-certificate-status-4-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-c99a9-ts-com-certificate-status-4-chromium/video-1.webm)
- [video](../test-artifacts/projects-recertificacao-te-c99a9-ts-com-certificate-status-4-chromium/video.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-c99a9-ts-com-certificate-status-4-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-c99a9-ts-com-certificate-status-4-chromium/trace.zip)

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