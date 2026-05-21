# [spec-fragil] Carga horária obrigatória bloqueia salvamento

> _Categoria confiança: **alta** — Locator bate em N elementos — seletor não-único_
> _Gerado em 2026-05-21T21:07:44.597Z · commit f90ba01_

## Identificação
- **Suite**: Criação de Modelo - Aba Estrutura do Conteúdo
- **TC**: Carga horária obrigatória bloqueia salvamento
- **Spec**: `projects/modelos/tests/features/criacao-de-modelo-aba-estrutura-do-conteudo/tc04-carga-horaria-obrigatoria-bloqueia-save.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\criacao-de-modelo-aba-estrutura-do-conteudo\tc04-carga-horaria-obrigatoria-bloqueia-save.spec.ts:27:27`
- **Status**: failed (20425ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: f90ba01

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Abrir aba Estrutura sem carga horária preenchida — ✅
  2. 2. Clicar Salvar e validar bloqueio (sem redirect/sem toast sucesso) — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toHaveCount(expected) failed
  
  Locator:  locator('.chakra-toast').filter({ hasText: /sucesso/i })
  Expected: 0
  Received: 3
  Timeout:  3000ms
  
  Call log:
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-modelos-tests-fea-26232-gatória-bloqueia-salvamento-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-modelos-tests-fea-26232-gatória-bloqueia-salvamento-chromium/video.webm)
- [error-context](../test-artifacts/projects-modelos-tests-fea-26232-gatória-bloqueia-salvamento-chromium/error-context.md)
- [trace](../test-artifacts/projects-modelos-tests-fea-26232-gatória-bloqueia-salvamento-chromium/trace.zip)

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