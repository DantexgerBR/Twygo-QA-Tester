# [inconclusivo] Renderizar widget 'Conteúdos em andamento' para o aluno

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-14T17:37:06.923Z · commit 167fabe_

## Identificação
- **Suite**: Dashboard - Visão do aluno
- **TC**: Renderizar widget 'Conteúdos em andamento' para o aluno
- **Spec**: `projects/widgets/tests/features/dashboard-visao-do-aluno/renderizar-widget-conteudos-andamento.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\src\pages\ProfileSwitcher.ts:74:34`
- **Status**: failed (26497ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: 167fabe

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar painel do aluno (switch para perfil Aluno via popover) — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toHaveText(expected) failed
  
  Locator: locator('button.menu-target')
  Timeout: 10000ms
  Expected pattern: /^Aluno/
  Received string:  "
  Aluno·
  "
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://widgets.stage.twygoead.com/api/v1/o/36988/beta_test/get_active_beta_test_notification?feature_name=estudio_de_criacao&with_notification_history=true` | **400** | não | — |
| GET | `https://widgets.stage.twygoead.com/api/v1/o/36988/beta_test/get_active_beta_test_notification?feature_name=agente_suporte_ia&with_notification_history=true` | **400** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-4c16b-s-em-andamento-para-o-aluno-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-4c16b-s-em-andamento-para-o-aluno-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-4c16b-s-em-andamento-para-o-aluno-chromium/video.webm)
- [error-context](../test-artifacts/projects-widgets-tests-fea-4c16b-s-em-andamento-para-o-aluno-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-4c16b-s-em-andamento-para-o-aluno-chromium/trace.zip)

### IDs envolvidos
- orgId: 36988

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