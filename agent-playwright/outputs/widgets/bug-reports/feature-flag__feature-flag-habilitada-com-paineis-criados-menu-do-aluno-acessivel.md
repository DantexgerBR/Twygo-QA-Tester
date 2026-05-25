# [inconclusivo] Feature flag habilitada com painéis criados - menu do aluno acessível

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-15T14:10:31.992Z · commit f0907b3_

## Identificação
- **Suite**: Feature flag
- **TC**: Feature flag habilitada com painéis criados - menu do aluno acessível
- **Spec**: `projects/widgets/tests/features/feature-flag/flag-habilitada-menu-aluno-acessivel.spec.ts`
- **Erro em**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\feature-flag\flag-habilitada-menu-aluno-acessivel.spec.ts:122:38`
- **Status**: failed (108442ms)

## Ambiente
- **Env**: staging-widgets (`https://widgets.stage.twygoead.com/`)
- **OrgId**: 36988
- **Usuário**: claude@teste.com
- **Browser**: chromium
- **Build/commit**: f0907b3

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Habilitar contrato (user_panels) + flag via Super Admin/Flipper — ✅
  2. 2. Como Admin: criar painel novo (toggle propagação cache) — ✅
  3. 3. Descobrir useModeId do Aluno e associar painel ao menu — ✅
  4. 4. Switch para perfil Aluno — ✅
  5. 5. Menu Painéis (item criado) acessível na visão Aluno — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: getByRole('link', { name: 'Item Painel TC FF-Aluno w1-1778854067580' }).first()
  Expected: visible
  Timeout: 30000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![step-01-1-Habilitar-contrato-user_panels-flag-via-Super-Admin-Flippe](../test-artifacts/projects-widgets-tests-fea-59c47-s---menu-do-aluno-acessível-chromium/attachments/step-01-1-Habilitar-contrato-user-panels-flag-via-Super-Admin-Flippe-fcdf560754ff77d7e9e8ad69c97e790e779dba66.png)
- ![step-02-2-Como-Admin-criar-painel-novo-toggle-propaga-o-cache](../test-artifacts/projects-widgets-tests-fea-59c47-s---menu-do-aluno-acessível-chromium/attachments/step-02-2-Como-Admin-criar-painel-novo-toggle-propaga-o-cache-76407945deb014d7b7b5321f18ecfaeb5f36fa97.png)
- ![step-03-3-Descobrir-useModeId-do-Aluno-e-associar-painel-ao-menu](../test-artifacts/projects-widgets-tests-fea-59c47-s---menu-do-aluno-acessível-chromium/attachments/step-03-3-Descobrir-useModeId-do-Aluno-e-associar-painel-ao-menu-2e1482f094053c6d7cf951b47fb285662531a552.png)
- ![step-04-4-Switch-para-perfil-Aluno](../test-artifacts/projects-widgets-tests-fea-59c47-s---menu-do-aluno-acessível-chromium/attachments/step-04-4-Switch-para-perfil-Aluno-1499c8a2a7a7497d34ee800e65e1161a8b673c7e.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-59c47-s---menu-do-aluno-acessível-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-widgets-tests-fea-59c47-s---menu-do-aluno-acessível-chromium/video-1.webm)
- [video](../test-artifacts/projects-widgets-tests-fea-59c47-s---menu-do-aluno-acessível-chromium/video.webm)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-59c47-s---menu-do-aluno-acessível-chromium/test-failed-2.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-59c47-s---menu-do-aluno-acessível-chromium/test-failed-3.png)
- [error-context](../test-artifacts/projects-widgets-tests-fea-59c47-s---menu-do-aluno-acessível-chromium/error-context.md)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-59c47-s---menu-do-aluno-acessível-chromium/test-failed-4.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-59c47-s---menu-do-aluno-acessível-chromium/test-failed-6.png)
- ![screenshot](../test-artifacts/projects-widgets-tests-fea-59c47-s---menu-do-aluno-acessível-chromium/test-failed-5.png)
- [error-context](../test-artifacts/projects-widgets-tests-fea-59c47-s---menu-do-aluno-acessível-chromium/error-context.md)
- [trace](../test-artifacts/projects-widgets-tests-fea-59c47-s---menu-do-aluno-acessível-chromium/trace.zip)

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