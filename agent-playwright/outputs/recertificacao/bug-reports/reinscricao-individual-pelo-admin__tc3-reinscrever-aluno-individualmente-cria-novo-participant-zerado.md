# [inconclusivo] TC3 — Reinscrever aluno individualmente cria novo participant zerado

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-29T12:33:21.639Z · commit 33924c8_

## Identificação
- **Suite**: Reinscrição Individual pelo Admin
- **TC**: TC3 — Reinscrever aluno individualmente cria novo participant zerado
- **Spec**: `projects/recertificacao/tests/features/reinscricao-individual-pelo-admin/tc3-reinscrever-aluno-cria-novo-participant-zerado.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\tests\features\reinscricao-individual-pelo-admin\tc3-reinscrever-aluno-cria-novo-participant-zerado.spec.ts:50:61`
- **Status**: failed (27947ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 33924c8

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Pré-condição: curso 807287 + aluno fixo richard.sebold@twygo.com (botão Reinscrever habilitado natural — recon 2026-05-28) — ✅
  2. 2. Acessar lista de aprendizagem do curso — ✅
  3. 3. Clicar "Iniciar reinscrição" no menu kebab da linha mais recente → Modal "Confirmar reinscrição" exibido — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: getByRole('dialog').filter({ hasText: /Confirmar reinscrição|Reinscrição/i }).first()
  Expected: visible
  Timeout: 10000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-db63e-ria-novo-participant-zerado-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-db63e-ria-novo-participant-zerado-chromium/video-1.webm)
- [video](../test-artifacts/projects-recertificacao-te-db63e-ria-novo-participant-zerado-chromium/video.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-db63e-ria-novo-participant-zerado-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-db63e-ria-novo-participant-zerado-chromium/trace.zip)

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