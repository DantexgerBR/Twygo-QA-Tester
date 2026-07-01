# [inconclusivo] TC2 — Recertificação de user não-aprovado retorna 422 com mensagem descritiva

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-28T19:46:18.281Z · commit 569a4ad_

## Identificação
- **Suite**: Reinscrição via API V2
- **TC**: TC2 — Recertificação de user não-aprovado retorna 422 com mensagem descritiva
- **Spec**: `projects/recertificacao/tests/api/reinscricao-via-api-v2.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\tests\api\reinscricao-via-api-v2.spec.ts:117:30`
- **Status**: failed (769ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.qa@claude.com
- **Browser**: api
- **Build/commit**: 569a4ad

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(received).toBeGreaterThan(expected)
  
  Expected: > 0
  Received:   0
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- [error-context](../test-artifacts/projects-recertificacao-te-60f85-422-com-mensagem-descritiva-api/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-60f85-422-com-mensagem-descritiva-api/trace.zip)

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