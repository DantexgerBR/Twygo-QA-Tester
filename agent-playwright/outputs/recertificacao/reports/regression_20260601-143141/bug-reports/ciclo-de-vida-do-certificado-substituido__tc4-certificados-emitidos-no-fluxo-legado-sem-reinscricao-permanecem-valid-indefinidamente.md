# [inconclusivo] TC4 — Certificados emitidos no fluxo legado (sem reinscrição) permanecem VALID indefinidamente

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-06-01T17:31:39.963Z · commit 88f26da_

## Identificação
- **Suite**: Ciclo de Vida do Certificado Substituído
- **TC**: TC4 — Certificados emitidos no fluxo legado (sem reinscrição) permanecem VALID indefinidamente
- **Spec**: `projects/recertificacao/tests/features/ciclo-de-vida-do-certificado-substituido/tc4-certificados-legado-permanecem-valid.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\tests\features\ciclo-de-vida-do-certificado-substituido\tc4-certificados-legado-permanecem-valid.spec.ts:77:36`
- **Status**: failed (30012ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 88f26da

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Pré-condição: aluno com recertification_number = 0 aprovado e VALID emitido → acessar lista de aprendizagem e verificar que a linha do aluno legado existe — ✅
  2. 2. Verificar que a linha do aluno legado exibe badge "Emitido" (VALID) → RN 20/21: sem reinscrição, o cert original permanece situation=2 (VALID); replace_previous_certificates_bulk não foi acionado — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: locator('tbody tr').filter({ hasText: 'richard.sebold@twygo.com' }).filter({ hasText: /Emitido/i }).first()
  Expected: visible
  Timeout: 10000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-8b492-necem-VALID-indefinidamente-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-8b492-necem-VALID-indefinidamente-chromium/video-1.webm)
- [video](../test-artifacts/projects-recertificacao-te-8b492-necem-VALID-indefinidamente-chromium/video.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-8b492-necem-VALID-indefinidamente-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-8b492-necem-VALID-indefinidamente-chromium/trace.zip)

### IDs envolvidos
- orgId: 37048

## Escopo
- **Reproduz em outro usuário?** `[REVISAR isolamento]`
- **Reproduz em outro env?** `[REVISAR isolamento]`
- **Regressão?** desconhecida `[REVISAR regressão]`
- **Workaround**: nenhum identificado `[REVISAR workaround]`

## Impacto
- **Severity sugerida**: **media** `[REVISAR severity]`
- **Impacto qualitativo**: desconhecido `[REVISAR impacto]`

---

> _Gerado por `gerar-bug-report-de-tc-red` v1.0.0. Campos `[REVISAR]` exigem validação humana antes de abrir task._