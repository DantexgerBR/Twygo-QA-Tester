# [inconclusivo] TC3 — Ativar e salvar o switch persiste `has_recertification = true`

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-27T11:43:38.432Z · commit b54a8c2_

## Identificação
- **Suite**: Configuração de Conteúdo (Switch "Habilitar reinscrição")
- **TC**: TC3 — Ativar e salvar o switch persiste `has_recertification = true`
- **Spec**: `projects/recertificacao/tests/features/configuracao-de-conteudo-switch-habilitar-reinscricao/tc3-ativar-e-salvar-persiste.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc3-ativar-e-salvar-persiste.spec.ts:61:67`
- **Status**: failed (13621ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: b54a8c2

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar a edição de um curso com `has_recertification = false` (tab "Acesso") — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: getByRole('checkbox', { name: /Habilitar reinscrição/i })
  Expected: visible
  Timeout: 10000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://recertificacao-testeqa.stage.twygoead.com/contents/807020/edit` | **404** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-ccb33-e-has-recertification-true--chromium/test-finished-1.png)
- ![screenshot](../test-artifacts/projects-recertificacao-te-ccb33-e-has-recertification-true--chromium/test-failed-2.png)
- [video](../test-artifacts/projects-recertificacao-te-ccb33-e-has-recertification-true--chromium/video-1.webm)
- [video](../test-artifacts/projects-recertificacao-te-ccb33-e-has-recertification-true--chromium/video.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-ccb33-e-has-recertification-true--chromium/error-context.md)
- ![screenshot](../test-artifacts/projects-recertificacao-te-ccb33-e-has-recertification-true--chromium/test-failed-3.png)
- [error-context](../test-artifacts/projects-recertificacao-te-ccb33-e-has-recertification-true--chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-ccb33-e-has-recertification-true--chromium/trace.zip)

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