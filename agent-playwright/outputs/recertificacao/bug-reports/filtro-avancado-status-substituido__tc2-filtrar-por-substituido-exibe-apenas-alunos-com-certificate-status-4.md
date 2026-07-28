# [spec-fragil] TC2 — Filtrar por "Substituído" exibe apenas alunos com certificate_status = 4

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-07-27T16:56:49.490Z · commit 7e29862_

## Identificação
- **Suite**: Filtro Avançado Status Substituído
- **TC**: TC2 — Filtrar por "Substituído" exibe apenas alunos com certificate_status = 4
- **Spec**: `projects/recertificacao/tests/features/filtro-avancado-status-substituido/tc2-filtrar-por-substituido-exibe-status-4.spec.ts`
- **Erro em**: `—`
- **Status**: timedOut (128855ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 7e29862

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar a lista de aprendizagem em "/learning_students" → Lista exibe todos os alunos — ✅
  2. 2. Abrir o filtro avançado de "Status do certificado", marcar APENAS a opção "Substituído" e aplicar → Drawer fecha, listagem refilra — ✅
  3. 3. Inspecionar as linhas listadas → Apenas alunos com certificate_status = 4 aparecem; demais (VALID, EXPIRED, PENDING) ficam ocultos — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Test timeout of 120000ms exceeded.
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-f6b62-os-com-certificate-status-4-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-f6b62-os-com-certificate-status-4-chromium/video-1.webm)
- [video](../test-artifacts/projects-recertificacao-te-f6b62-os-com-certificate-status-4-chromium/video.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-f6b62-os-com-certificate-status-4-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-f6b62-os-com-certificate-status-4-chromium/trace.zip)

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