# [inconclusivo] TC2 — Botão "Reinscrever" visível apenas na linha do participant com maior recertification_number

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-29T12:33:21.639Z · commit 33924c8_

## Identificação
- **Suite**: Reinscrição Individual pelo Admin
- **TC**: TC2 — Botão "Reinscrever" visível apenas na linha do participant com maior recertification_number
- **Spec**: `projects/recertificacao/tests/features/reinscricao-individual-pelo-admin/tc2-botao-reinscrever-apenas-maior-recertification-number.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\tests\features\reinscricao-individual-pelo-admin\tc2-botao-reinscrever-apenas-maior-recertification-number.spec.ts:78:42`
- **Status**: failed (35511ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 33924c8

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Pré-condição: aluno com múltiplas reinscrições no 807287 (Richard tem 5) — ✅
  2. 2. Acessar lista de aprendizagem → múltiplas linhas do mesmo aluno — ✅
  3. 3. APENAS a primeira linha (mais recente, maior recert_num) tem botão "Iniciar reinscrição" habilitado — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(received).toBe(expected) // Object.is equality
  
  Expected: 1
  Received: 0
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-2e3bc-aior-recertification-number-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-2e3bc-aior-recertification-number-chromium/video.webm)
- [video](../test-artifacts/projects-recertificacao-te-2e3bc-aior-recertification-number-chromium/video-1.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-2e3bc-aior-recertification-number-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-2e3bc-aior-recertification-number-chromium/trace.zip)

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