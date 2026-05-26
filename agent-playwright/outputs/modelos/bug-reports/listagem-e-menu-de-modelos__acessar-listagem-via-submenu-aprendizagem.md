# [inconclusivo] Acessar listagem via submenu Aprendizagem

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-25T14:14:53.491Z · commit 83d0916_

## Identificação
- **Suite**: Listagem e Menu de Modelos
- **TC**: Acessar listagem via submenu Aprendizagem
- **Spec**: `projects/modelos/tests/features/listagem-e-menu-de-modelos/tc01-acessar-listagem-via-submenu-aprendizagem.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\listagem-e-menu-de-modelos\tc01-acessar-listagem-via-submenu-aprendizagem.spec.ts:19:26`
- **Status**: failed (68671ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 83d0916

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Navegar para dashboard admin e aguardar carregado — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(page).toHaveURL(expected) failed
  
  Expected pattern: /dashboard/
  Received string:  "https://basedeconhecimento.stage.twygoead.com/users/login"
  Timeout: 60000ms
  
  Call log:
    - Expect "toHaveURL" with timeout 60000ms
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-modelos-tests-fea-3d814-em-via-submenu-Aprendizagem-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-modelos-tests-fea-3d814-em-via-submenu-Aprendizagem-chromium/video.webm)
- [error-context](../test-artifacts/projects-modelos-tests-fea-3d814-em-via-submenu-Aprendizagem-chromium/error-context.md)
- [trace](../test-artifacts/projects-modelos-tests-fea-3d814-em-via-submenu-Aprendizagem-chromium/trace.zip)

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