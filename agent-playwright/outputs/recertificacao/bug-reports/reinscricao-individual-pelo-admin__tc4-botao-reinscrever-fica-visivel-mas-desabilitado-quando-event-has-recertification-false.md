# [inconclusivo] TC4 — Botão "Reinscrever" fica visível mas DESABILITADO quando event.has_recertification = false

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-28T19:50:39.338Z · commit 569a4ad_

## Identificação
- **Suite**: Reinscrição Individual pelo Admin
- **TC**: TC4 — Botão "Reinscrever" fica visível mas DESABILITADO quando event.has_recertification = false
- **Spec**: `projects/recertificacao/tests/features/reinscricao-individual-pelo-admin/tc4-botao-reinscrever-disabled-has-recertification-false.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\LearningStudentsPage.ts:677:28`
- **Status**: failed (127532ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 569a4ad

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Pré-condição: cursoSeed default (has_recertification=false) + aluno matriculado via fixture canônica — ✅
  2. 2. Acessar lista de aprendizagem do curso → Aluno listado — ✅
  3. 3. Abrir menu de ações da linha do aluno → Item "Reinscrever" exibido mas DESABILITADO — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(received).toBe(expected) // Object.is equality
  
  Expected: true
  Received: false
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-6e331-t-has-recertification-false-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-6e331-t-has-recertification-false-chromium/video-1.webm)
- [video](../test-artifacts/projects-recertificacao-te-6e331-t-has-recertification-false-chromium/video.webm)
- ![screenshot](../test-artifacts/projects-recertificacao-te-6e331-t-has-recertification-false-chromium/test-failed-2.png)
- ![screenshot](../test-artifacts/projects-recertificacao-te-6e331-t-has-recertification-false-chromium/test-failed-3.png)
- ![screenshot](../test-artifacts/projects-recertificacao-te-6e331-t-has-recertification-false-chromium/test-failed-4.png)
- ![screenshot](../test-artifacts/projects-recertificacao-te-6e331-t-has-recertification-false-chromium/test-failed-5.png)
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
- **Severity sugerida**: **media** `[REVISAR severity]`
- **Impacto qualitativo**: desconhecido `[REVISAR impacto]`

---

> _Gerado por `gerar-bug-report-de-tc-red` v1.0.0. Campos `[REVISAR]` exigem validação humana antes de abrir task._