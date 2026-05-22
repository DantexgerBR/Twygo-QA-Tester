# [inconclusivo] Salvar Página retorna para aba Design do Modelo

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-22T12:13:23.587Z · commit 8d4e765_

## Identificação
- **Suite**: Criação de Design de Página
- **TC**: Salvar Página retorna para aba Design do Modelo
- **Spec**: `projects/modelos/tests/features/criacao-de-design-de-pagina/tc07-salvar-pagina-retorna-design-modelo.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\criacao-de-design-de-pagina\tc07-salvar-pagina-retorna-design-modelo.spec.ts:44:73`
- **Status**: failed (57452ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 8d4e765

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Criar Página até aba Design — ✅
  2. 2. Clicar Salvar (Design) e validar retorno pra aba Design do Modelo — ✅
  3. 3. Validar listagem atualizada com o novo Design — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: getByText('Design TC7 w4-1779451715441', { exact: true }).first()
  Expected: visible
  Timeout: 10000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-modelos-tests-fea-7970b-a-para-aba-Design-do-Modelo-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-modelos-tests-fea-7970b-a-para-aba-Design-do-Modelo-chromium/video.webm)
- [error-context](../test-artifacts/projects-modelos-tests-fea-7970b-a-para-aba-Design-do-Modelo-chromium/error-context.md)
- [trace](../test-artifacts/projects-modelos-tests-fea-7970b-a-para-aba-Design-do-Modelo-chromium/trace.zip)

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