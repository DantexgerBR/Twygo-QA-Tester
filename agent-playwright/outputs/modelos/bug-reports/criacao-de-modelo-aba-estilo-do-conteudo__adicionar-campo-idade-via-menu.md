# [spec-fragil] Adicionar campo Idade via menu

> _Categoria confiança: **media** — Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp_
> _Gerado em 2026-05-21T21:07:44.597Z · commit f90ba01_

## Identificação
- **Suite**: Criação de Modelo - Aba Estilo do Conteúdo
- **TC**: Adicionar campo Idade via menu
- **Spec**: `projects/modelos/tests/features/criacao-de-modelo-aba-estilo-do-conteudo/tc02-adicionar-campo-idade.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:162:41`
- **Status**: failed (45051ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: f90ba01

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Abrir modelo seedado na aba Estilo — ✅
  2. 2. Abrir menu "Adicionar mais dados" — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.click: Timeout 30000ms exceeded.
  Call log:
    - waiting for locator('[data-test-id="content-models-style-add-more-data-button"]')
      - locator resolved to <button disabled type="button" aria-haspopup="menu" aria-expanded="false" id="menu-button-:r1j:" aria-controls="menu-list-:r1j:" data-test-id="content-models-style-add-more-data-button" class="chakra-button chakra-menu__menu-button css-7vf75e">…</button>
    - attempting click action
      2 × waiting for element to be visible, enabled and stable
        - element is not enabled
      - retrying click action
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-modelos-tests-fea-d9836-cionar-campo-Idade-via-menu-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-modelos-tests-fea-d9836-cionar-campo-Idade-via-menu-chromium/video.webm)
- [error-context](../test-artifacts/projects-modelos-tests-fea-d9836-cionar-campo-Idade-via-menu-chromium/error-context.md)
- [trace](../test-artifacts/projects-modelos-tests-fea-d9836-cionar-campo-Idade-via-menu-chromium/trace.zip)

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