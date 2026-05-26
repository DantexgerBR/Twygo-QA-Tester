# [spec-fragil] Filtrar designs por Tipo (Aula/Página)

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-25T14:14:53.491Z · commit 83d0916_

## Identificação
- **Suite**: Listagem de Designs (aba Design do Modelo)
- **TC**: Filtrar designs por Tipo (Aula/Página)
- **Spec**: `projects/modelos/tests/features/listagem-de-designs-aba-design-do-modelo/tc03-filtrar-designs-por-tipo.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:185:54`
- **Status**: failed (57809ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 83d0916

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Abrir aba Design do modelo — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.fill: Timeout 30000ms exceeded.
  Call log:
    - waiting for locator('#play-interest-search')
  
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- [video](../test-artifacts/projects-modelos-tests-fea-0ec35-signs-por-Tipo-Aula-Página--chromium/video.webm)
- [error-context](../test-artifacts/projects-modelos-tests-fea-0ec35-signs-por-Tipo-Aula-Página--chromium/error-context.md)
- [trace](../test-artifacts/projects-modelos-tests-fea-0ec35-signs-por-Tipo-Aula-Página--chromium/trace.zip)

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