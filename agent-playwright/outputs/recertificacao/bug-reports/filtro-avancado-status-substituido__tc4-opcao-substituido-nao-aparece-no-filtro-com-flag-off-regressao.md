# [inconclusivo] TC4 — Opção "Substituído" NÃO aparece no filtro com flag OFF (regressão)

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-07-27T15:52:57.693Z · commit f1d0367_

## Identificação
- **Suite**: Filtro Avançado Status Substituído
- **TC**: TC4 — Opção "Substituído" NÃO aparece no filtro com flag OFF (regressão)
- **Spec**: `projects/recertificacao/tests/features/filtro-avancado-status-substituido/tc4-opcao-substituido-nao-aparece-flag-off-regressao.spec.ts`
- **Erro em**: `D:\Estudo\Programação\cursor\twygo-work\Twygo-QA-Tester\agent-playwright\projects\recertificacao\tests\features\filtro-avancado-status-substituido\tc4-opcao-substituido-nao-aparece-flag-off-regressao.spec.ts:70:28`
- **Status**: failed (40249ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: f1d0367

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Desativar a feature flag `:recertificacao` → Flag OFF — ✅
  2. 2. Acessar a lista de aprendizagem e abrir o filtro avançado de Status do certificado → Drawer de filtro é exibido — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(page).toHaveURL(expected) failed
  
  Expected pattern: /\/e\/\d+\/learning/
  Received string:  "https://recertificacao-testeqa.stage.twygoead.com/o/37048/edit?profile=admin"
  Timeout: 10000ms
  
  Call log:
    - Expect "toHaveURL" with timeout 10000ms
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://recertificacao-testeqa.stage.twygoead.com/api/v1/o/37048/share_certificate_configs` | **404** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-2dce4-tro-com-flag-OFF-regressão--chromium/test-finished-1.png)
- ![screenshot](../test-artifacts/projects-recertificacao-te-2dce4-tro-com-flag-OFF-regressão--chromium/test-failed-2.png)
- [video](../test-artifacts/projects-recertificacao-te-2dce4-tro-com-flag-OFF-regressão--chromium/video-1.webm)
- [video](../test-artifacts/projects-recertificacao-te-2dce4-tro-com-flag-OFF-regressão--chromium/video.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-2dce4-tro-com-flag-OFF-regressão--chromium/error-context.md)
- [error-context](../test-artifacts/projects-recertificacao-te-2dce4-tro-com-flag-OFF-regressão--chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-2dce4-tro-com-flag-OFF-regressão--chromium/trace.zip)

### IDs envolvidos
- orgId: 37048

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