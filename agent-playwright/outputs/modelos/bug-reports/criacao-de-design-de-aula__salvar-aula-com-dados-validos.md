# [inconclusivo] Salvar Aula com dados válidos

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-22T12:13:23.587Z · commit 8d4e765_

## Identificação
- **Suite**: Criação de Design de Aula
- **TC**: Salvar Aula com dados válidos
- **Spec**: `projects/modelos/tests/features/criacao-de-design-de-aula/tc02-salvar-aula-dados-validos.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\criacao-de-design-de-aula\tc02-salvar-aula-dados-validos.spec.ts:32:30`
- **Status**: failed (60301ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 8d4e765

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Abrir tela de criação Aula — ✅
  2. 2-4. Preencher Nome + Tipo "Introdução" + Sequência — ✅
  3. 5. Salvar e validar redirect pra aba Design da Aula — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(page).not.toHaveURL(expected) failed
  
  Expected pattern: not /template_designs\/new/
  Received string: "https://basedeconhecimento.stage.twygoead.com/o/37007/content_models/7/template_designs/new?kind=lesson"
  Timeout: 10000ms
  
  Call log:
    - Expect "not toHaveURL" with timeout 10000ms
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-modelos-tests-fea-f0989-lvar-Aula-com-dados-válidos-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-modelos-tests-fea-f0989-lvar-Aula-com-dados-válidos-chromium/video.webm)
- [error-context](../test-artifacts/projects-modelos-tests-fea-f0989-lvar-Aula-com-dados-válidos-chromium/error-context.md)
- [trace](../test-artifacts/projects-modelos-tests-fea-f0989-lvar-Aula-com-dados-válidos-chromium/trace.zip)

### IDs envolvidos
- orgId: 37007

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