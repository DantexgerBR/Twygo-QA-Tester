# [modal-nao-tratado] TC1 — Switch "Habilitar reinscrição" aparece com flag ON na edição de curso

> _Categoria confiança: **alta** — Click interceptado — overlay/modal por cima do alvo_
> _Gerado em 2026-06-01T11:44:11.315Z · commit 62d85ed_

## Identificação
- **Suite**: Configuração de Conteúdo (Switch "Habilitar reinscrição")
- **TC**: TC1 — Switch "Habilitar reinscrição" aparece com flag ON na edição de curso
- **Spec**: `projects/recertificacao/tests/features/configuracao-de-conteudo-switch-habilitar-reinscricao/tc1-switch-aparece-com-flag-on.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\ContentEditPage.ts:147:23`
- **Status**: failed (75752ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 62d85ed

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Acessar a URL "/o/{orgId}/dashboard" — ✅
  2. 2. Navegar até a listagem de cursos da organização — ✅
  3. 3. Clicar em "Gerenciar" no menu de ações do curso → página de edição é exibida — ✅
  4. 4. Switch "Habilitar reinscrição" está visível no formulário (tab "Acesso" do facelift) — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  TimeoutError: locator.click: Timeout 30000ms exceeded.
  Call log:
    - waiting for locator('[data-test-id="tab-access"]').or(getByRole('tab', { name: /^Acesso$/i })).first()
      - locator resolved to <button role="tab" name="access" type="button" tabindex="-1" data-index="1" aria-disabled="false" id="tabs-:rs:--tab-1" aria-selected="false" data-tab-name="access" data-test-id="tab-access" class="chakra-tabs__tab css-fuqmym" aria-controls="tabs-:rs:--tabpanel-1">Acesso</button>
    - attempting click action
      2 × waiting for element to be visible, enabled and stable
        - element is visible, enabled and stable
        - scrolling into view if needed
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| GET | `https://recertificacao-testeqa.stage.twygoead.com/api/v1/o/37048/beta_test/get_active_beta_test_notification?feature_name=estudio_de_criacao&with_notification_history=true` | **400** | não | — |
| GET | `https://recertificacao-testeqa.stage.twygoead.com/api/v1/o/37048/beta_test/get_active_beta_test_notification?feature_name=agente_suporte_ia&with_notification_history=true` | **400** | não | — |
| GET | `https://recertificacao-testeqa.stage.twygoead.com/api/v1/o/37048/beta_test/get_active_beta_test_notification?feature_name=estudio_de_criacao&with_notification_history=true` | **400** | não | — |
| GET | `https://recertificacao-testeqa.stage.twygoead.com/api/v1/o/37048/beta_test/get_active_beta_test_notification?feature_name=agente_suporte_ia&with_notification_history=true` | **400** | não | — |
| GET | `https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25` | **401** | não | — |
| GET | `https://chat-staging.twygo.com.br/v1/notificates/all?page=1&per_page=25` | **401** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium/test-finished-1.png)
- ![screenshot](../test-artifacts/projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium/test-failed-2.png)
- [video](../test-artifacts/projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium/video-1.webm)
- [video](../test-artifacts/projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium/video.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium/error-context.md)
- ![screenshot](../test-artifacts/projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium/test-failed-3.png)
- [error-context](../test-artifacts/projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium/trace.zip)

### IDs envolvidos
- orgId: 37048

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