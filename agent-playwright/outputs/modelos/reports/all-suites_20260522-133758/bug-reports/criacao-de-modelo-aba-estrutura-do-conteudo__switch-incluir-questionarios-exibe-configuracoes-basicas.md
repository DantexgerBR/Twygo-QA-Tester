# [spec-fragil] Switch "Incluir questionários" exibe configurações básicas

> _Categoria confiança: **alta** — Locator bate em N elementos — seletor não-único_
> _Gerado em 2026-05-21T21:07:44.597Z · commit f90ba01_

## Identificação
- **Suite**: Criação de Modelo - Aba Estrutura do Conteúdo
- **TC**: Switch "Incluir questionários" exibe configurações básicas
- **Spec**: `projects/modelos/tests/features/criacao-de-modelo-aba-estrutura-do-conteudo/tc06-switch-incluir-questionarios.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\criacao-de-modelo-aba-estrutura-do-conteudo\tc06-switch-incluir-questionarios.spec.ts:32:9`
- **Status**: failed (15524ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: f90ba01

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Abrir aba Estrutura com seção "Questionários ao longo do conteúdo" — ✅
  2. 2. Ativar switch "Incluir questionários" e validar configurações expostas — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: getByText('Configurações avançadas', { exact: true })
  Expected: visible
  Error: strict mode violation: getByText('Configurações avançadas', { exact: true }) resolved to 2 elements:
      1) <div class="css-yljlks">Configurações avançadas</div> aka getByText('Configurações avançadas').first()
      2) <div class="css-yljlks">Configurações avançadas</div> aka getByText('Configurações avançadas').nth(1)
  
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-modelos-tests-fea-ca9a9-exibe-configurações-básicas-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-modelos-tests-fea-ca9a9-exibe-configurações-básicas-chromium/video.webm)
- [error-context](../test-artifacts/projects-modelos-tests-fea-ca9a9-exibe-configurações-básicas-chromium/error-context.md)
- [trace](../test-artifacts/projects-modelos-tests-fea-ca9a9-exibe-configurações-básicas-chromium/trace.zip)

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