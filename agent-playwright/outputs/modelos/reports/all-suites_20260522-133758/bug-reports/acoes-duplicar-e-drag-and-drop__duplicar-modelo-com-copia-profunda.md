# [inconclusivo] Duplicar modelo com cópia profunda

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-21T21:07:44.597Z · commit f90ba01_

## Identificação
- **Suite**: Ações Duplicar e Drag and Drop
- **TC**: Duplicar modelo com cópia profunda
- **Spec**: `projects/modelos/tests/features/acoes-duplicar-e-drag-and-drop/tc01-duplicar-modelo-copia-profunda.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\acoes-duplicar-e-drag-and-drop\tc01-duplicar-modelo-copia-profunda.spec.ts:41:9`
- **Status**: failed (28498ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: f90ba01

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar listagem de modelos — ✅
  2. 2. Clicar Duplicar (icon content_copy) do 1º modelo — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: locator('.chakra-toast').filter({ hasText: 'duplicado com sucesso' }).first()
  Expected: visible
  Timeout: 15000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-modelos-tests-fea-81805-r-modelo-com-cópia-profunda-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-modelos-tests-fea-81805-r-modelo-com-cópia-profunda-chromium/video.webm)
- [error-context](../test-artifacts/projects-modelos-tests-fea-81805-r-modelo-com-cópia-profunda-chromium/error-context.md)
- ![screenshot](../test-artifacts/projects-modelos-tests-fea-81805-r-modelo-com-cópia-profunda-chromium/test-failed-2.png)
- [error-context](../test-artifacts/projects-modelos-tests-fea-81805-r-modelo-com-cópia-profunda-chromium/error-context.md)
- [trace](../test-artifacts/projects-modelos-tests-fea-81805-r-modelo-com-cópia-profunda-chromium/trace.zip)

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