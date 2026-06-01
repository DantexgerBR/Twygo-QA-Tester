# [spec-fragil] TC2 — Worker ExpiresCertificates expira VALID e propaga para REPLACED do mesmo par

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-06-01T14:04:44.598Z · commit 88f26da_

## Identificação
- **Suite**: Ciclo de Vida do Certificado Substituído
- **TC**: TC2 — Worker ExpiresCertificates expira VALID e propaga para REPLACED do mesmo par
- **Spec**: `projects/recertificacao/tests/features/ciclo-de-vida-do-certificado-substituido/tc2-worker-expires-certificates-propaga.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\SeedAdminPage.ts:1346:8`
- **Status**: failed (34508ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 88f26da

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
    - waiting for getByRole('heading', { name: /Lista de Participantes/i }).first() to be visible
  
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-66afe--para-REPLACED-do-mesmo-par-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-66afe--para-REPLACED-do-mesmo-par-chromium/video.webm)
- [video](../test-artifacts/projects-recertificacao-te-66afe--para-REPLACED-do-mesmo-par-chromium/video-1.webm)
- ![screenshot](../test-artifacts/projects-recertificacao-te-66afe--para-REPLACED-do-mesmo-par-chromium/test-failed-2.png)
- [error-context](../test-artifacts/projects-recertificacao-te-66afe--para-REPLACED-do-mesmo-par-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-66afe--para-REPLACED-do-mesmo-par-chromium/trace.zip)

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